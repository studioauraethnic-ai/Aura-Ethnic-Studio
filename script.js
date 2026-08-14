// ============================================================
// AURA ETHNIC STUDIO — WEBSITE LOGIC
// ============================================================

const WHATSAPP_NUMBER = "917891582196"; // Replace with your WhatsApp number.

const HERO_IMAGES = [
  "hero-new-arrivals.webp",
  "hero-editorial.png",
  "kurti-01.jpg"
];

const PRODUCTS = (window.AURA_PRODUCTS || []).map(p => ({collection:"main", price:500, mrp:999, ...p}));
const MORE_PRODUCTS = (window.AURA_MORE_PRODUCTS || []).map(p => ({collection:"more", price:500, mrp:999, ...p}));

let cart=JSON.parse(localStorage.getItem("auraPremiumCart")||"[]");
let heroIndex=0,heroTimer,modalProduct=null,modalIndex=0;
const $=id=>document.getElementById(id);
const cardIndexes={};
const HOME_PRODUCT_LIMIT=6;
const MORE_HOME_PRODUCT_LIMIT=4;

function allCatalogProducts(){return [...PRODUCTS,...MORE_PRODUCTS]}
function getProduct(id){return allCatalogProducts().find(p=>String(p.id)===String(id))}
function discountPercent(p){
  if(Number.isFinite(Number(p.discount)) && Number(p.discount)>0) return Number(p.discount);
  const mrp=Number(p.mrp)||999,price=Number(p.price)||500;
  return mrp>price?Math.round((1-price/mrp)*100):0;
}
function priceMarkup(p,suffix="• 1 Set"){
  const mrp=Number(p.mrp)||999,price=Number(p.price)||500,off=discountPercent(p);
  return `<span class="old-price">₹${mrp}</span><strong>₹${price}</strong>${off?`<span class="discount">${off}% OFF</span>`:""}<small>${suffix}</small>`;
}
function productCard(p,i){
  const off=discountPercent(p);
  return `<article class="product-card" style="animation-delay:${Math.min(i*50,300)}ms">
    <div class="product-image">
      <img id="cardimg-${p.id}" src="${p.images[0]}" alt="${p.name}" loading="lazy">
      ${p.badge?`<span class="badge">${p.badge}</span>`:""}
      ${off?`<span class="sale-badge">${off}% OFF</span>`:""}
      <button class="wishlist" onclick="event.stopPropagation();this.textContent=this.textContent==='♡'?'♥':'♡'">♡</button>
      <div class="image-nav"><button onclick="event.stopPropagation();changeCardImage('${p.id}',-1)">‹</button><button onclick="event.stopPropagation();changeCardImage('${p.id}',1)">›</button></div>
    </div>
    <div class="product-info">
      <div class="fabric">${p.fabric||"ETHNIC STYLE"}</div><h3>${p.name}</h3>
      <div class="price">${priceMarkup(p)}</div>
      <button class="quick" onclick="openProduct('${p.id}')">VIEW DETAILS</button>
    </div>
  </article>`;
}

function initHero(){
  if(!$("heroSlider"))return;
  $("heroSlider").innerHTML=HERO_IMAGES.map((src,i)=>`<div class="hero-slide ${i===0?"active":""}" style="background-image:url('${src}')"></div>`).join("");
  $("heroDots").innerHTML=HERO_IMAGES.map((_,i)=>`<button class="${i===0?"active":""}" onclick="setHero(${i})"></button>`).join("");
  heroTimer=setInterval(()=>setHero((heroIndex+1)%HERO_IMAGES.length),4500);
}
function setHero(i){
  heroIndex=i;
  document.querySelectorAll(".hero-slide").forEach((e,n)=>e.classList.toggle("active",n===i));
  document.querySelectorAll(".hero-dots button").forEach((e,n)=>e.classList.toggle("active",n===i));
}
if($("heroPrev"))$("heroPrev").onclick=()=>setHero((heroIndex-1+HERO_IMAGES.length)%HERO_IMAGES.length);
if($("heroNext"))$("heroNext").onclick=()=>setHero((heroIndex+1)%HERO_IMAGES.length);

function filteredList(source){
  const fabric=$("fabricFilter")?.value||"all",badge=$("badgeFilter")?.value||"all",sort=$("sortFilter")?.value||"featured",q=($("searchInput")?.value||"").toLowerCase().trim();
  let list=source.filter(p=>(fabric==="all"||p.fabric===fabric)&&(badge==="all"||p.badge===badge)&&(!q||p.name.toLowerCase().includes(q)||String(p.fabric||"").toLowerCase().includes(q)||String(p.badge||"").toLowerCase().includes(q)));
  if(sort==="name")list.sort((a,b)=>a.name.localeCompare(b.name));
  return list;
}
function renderProducts(){
  if(!$("productGrid"))return;
  const isMore=document.body.dataset.page==="more-products",source=isMore?MORE_PRODUCTS:PRODUCTS,list=filteredList(source);
  if(isMore){
    const size=12,totalPages=Math.max(1,Math.ceil(list.length/size));
    window.moreCurrentPage=Math.min(window.moreCurrentPage||1,totalPages);
    const page=window.moreCurrentPage||1,pageItems=list.slice((page-1)*size,page*size);
    $("productsCount").textContent=`${list.length} styles • Page ${page} of ${totalPages}`;
    $("noResults").classList.toggle("hidden",list.length!==0);
    $("productGrid").innerHTML=pageItems.map(productCard).join("");
    renderPagination(list.length,page,size);
  }else{
    const visibleList=document.body.dataset.page==="products"?list:list.slice(0,HOME_PRODUCT_LIMIT);
    $("noResults").classList.toggle("hidden",list.length!==0);
    $("productGrid").innerHTML=visibleList.map(productCard).join("");
  }
}
function renderMoreHome(){
  if(!$("moreProductGrid"))return;
  const list=MORE_PRODUCTS.slice(0,MORE_HOME_PRODUCT_LIMIT);
  $("moreProductGrid").innerHTML=list.map(productCard).join("");
  $("moreProductsEmpty").classList.toggle("hidden",list.length!==0);
}
function renderPagination(total,page,size){
  const pg=$("pagination");if(!pg)return;const totalPages=Math.max(1,Math.ceil(total/size));pg.innerHTML="";
  if(totalPages>1){
    if(page>1)pg.innerHTML+=`<button onclick="goMorePage(${page-1})">←</button>`;
    for(let i=1;i<=totalPages;i++)pg.innerHTML+=`<button class="${i===page?'active':''}" onclick="goMorePage(${i})">${i}</button>`;
    if(page<totalPages)pg.innerHTML+=`<button onclick="goMorePage(${page+1})">→</button>`;
  }
}
function goMorePage(n){window.moreCurrentPage=n;renderProducts();window.scrollTo({top:document.querySelector(".section")?.offsetTop-80||0,behavior:"smooth"})}
function changeCardImage(id,dir){
  const p=getProduct(id);if(!p)return;
  cardIndexes[id]=(cardIndexes[id]||0)+dir;
  if(cardIndexes[id]<0)cardIndexes[id]=p.images.length-1;
  if(cardIndexes[id]>=p.images.length)cardIndexes[id]=0;
  const img=$("cardimg-"+id);if(img)img.src=p.images[cardIndexes[id]];
}

["fabricFilter","badgeFilter","sortFilter"].forEach(id=>{if($(id))$(id).onchange=()=>{window.moreCurrentPage=1;renderProducts()}});
if($("searchInput"))$("searchInput").oninput=()=>{window.moreCurrentPage=1;renderProducts()};
if($("searchBtn"))$("searchBtn").onclick=()=>{$("searchPanel").classList.toggle("open");if($("searchPanel").classList.contains("open"))$("searchInput").focus()};
if($("menuBtn"))$("menuBtn").onclick=()=>$("mobileNav").classList.toggle("open");
document.querySelectorAll(".mobile-nav a").forEach(a=>a.onclick=()=>$("mobileNav").classList.remove("open"));
document.querySelectorAll(".fabric-grid button").forEach(b=>b.onclick=()=>{if($("fabricFilter"))$("fabricFilter").value=b.dataset.fabric;renderProducts();if($("shop"))$("shop").scrollIntoView({behavior:"smooth"})});

function openProduct(id){
  modalProduct=getProduct(id);modalIndex=0;if(!modalProduct)return;
  $("modalBadge").textContent=modalProduct.badge||"";
  $("modalFabric").textContent=modalProduct.fabric||"";
  $("modalFabricValue").textContent=modalProduct.fabric||"";
  $("modalName").textContent=modalProduct.name;
  $("modalDescription").textContent=modalProduct.description||"Premium kurti from Aura Ethnic Studio.";
  if($("modalPrice"))$("modalPrice").innerHTML=priceMarkup(modalProduct);
  const off=discountPercent(modalProduct);
  if($("modalDiscount")){$("modalDiscount").textContent=off?`${off}% OFF`:"";$("modalDiscount").classList.toggle("hidden",!off)}
  if($("modalAdd"))$("modalAdd").textContent=`ADD TO CART — ₹${Number(modalProduct.price)||500}`;
  renderModal();$("productModal").classList.remove("hidden");
}
function renderModal(){
  $("modalImage").src=modalProduct.images[modalIndex];
  $("modalThumbs").innerHTML=modalProduct.images.map((src,i)=>`<img src="${src}" class="${i===modalIndex?"active":""}" onclick="modalIndex=${i};renderModal()">`).join("");
}
if($("modalPrev"))$("modalPrev").onclick=()=>{modalIndex=(modalIndex-1+modalProduct.images.length)%modalProduct.images.length;renderModal()};
if($("modalNext"))$("modalNext").onclick=()=>{modalIndex=(modalIndex+1)%modalProduct.images.length;renderModal()};
if($("modalAdd"))$("modalAdd").onclick=()=>{addToCart(modalProduct.id,$("modalSize").value);$("productModal").classList.add("hidden")};

function addToCart(id,size="M"){const x=cart.find(i=>String(i.id)===String(id)&&i.size===size);if(x)x.qty++;else cart.push({id,size,qty:1});saveCart();openCart()}
function bundleTotal(sets){
  if(sets<=0)return 0;if(sets===1)return 500;if(sets===2)return 800;if(sets===3)return 1000;
  return Math.floor(sets/3)*1000+(sets%3===1?500:800);
}
function saveCart(){localStorage.setItem("auraPremiumCart",JSON.stringify(cart));updateCart();renderCart()}
function updateCart(){if($("cartCount"))$("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0)}
function renderCart(){
  if(!$("cartItems"))return;
  const sets=cart.reduce((s,x)=>s+x.qty,0);$("cartSets").textContent=sets;$("cartTotal").textContent="₹"+bundleTotal(sets);
  $("cartItems").innerHTML=cart.length?cart.map((x,i)=>{const p=getProduct(x.id);if(!p)return "";return `<div class="cart-item"><img src="${p.images[0]}" alt="${p.name}"><div><h4>${p.name}</h4><small>${p.fabric||"Ethnic Style"} • Size ${x.size}</small><div class="qty"><button onclick="changeQty(${i},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${i},1)">+</button></div></div><button class="remove" onclick="removeItem(${i})">REMOVE</button></div>`}).join(""):`<p style="color:#877870;font-size:12px">Your shopping bag is empty.</p>`;
}
function changeQty(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);saveCart()}
function removeItem(i){cart.splice(i,1);saveCart()}
function openCart(){renderCart();$("cartDrawer").classList.add("open");$("overlay").classList.add("show")}
function closeCart(){$("cartDrawer").classList.remove("open");$("overlay").classList.remove("show")}
if($("cartBtn"))$("cartBtn").onclick=openCart;if($("closeCart"))$("closeCart").onclick=closeCart;if($("overlay"))$("overlay").onclick=closeCart;
if($("checkoutBtn"))$("checkoutBtn").onclick=()=>{if(!cart.length){alert("Your shopping bag is empty.");return}closeCart();$("checkoutModal").classList.remove("hidden")};
if($("checkoutForm"))$("checkoutForm").onsubmit=e=>{
  e.preventDefault();
  const name=$("customerName").value.trim(),phone=$("customerPhone").value.trim(),email=$("customerEmail").value.trim(),address=$("customerAddress").value.trim(),city=$("customerCity").value.trim(),state=$("customerState").value.trim(),pin=$("customerPincode").value.trim(),payment=$("customerPayment").value,note=$("customerNote").value.trim();
  if(!/^\d{6}$/.test(pin)){alert("Please enter a valid 6-digit PIN code.");return}
  const sets=cart.reduce((s,x)=>s+x.qty,0),total=bundleTotal(sets);
  const items=cart.map(x=>{const p=getProduct(x.id);if(!p)return "";return `• ${p.name} | ${p.collection==="more"?"More Styles":"Kurtis"} | Fabric: ${p.fabric||"Ethnic Style"} | Size: ${x.size} | Qty: ${x.qty}`}).filter(Boolean).join("\n");
  const message=`*AURA ETHNIC STUDIO — NEW ORDER*%0A%0A*CUSTOMER DETAILS*%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AEmail: ${encodeURIComponent(email)}%0A%0A*DELIVERY ADDRESS*%0A${encodeURIComponent(address)}%0ACity: ${encodeURIComponent(city)}%0AState: ${encodeURIComponent(state)}%0APIN: ${encodeURIComponent(pin)}%0A%0A*ORDER ITEMS*%0A${encodeURIComponent(items)}%0A%0ATotal Sets: ${sets}%0AOrder Total: ₹${total}%0AShipping: ₹0%0AExpected Delivery: *3–4 Days*%0APayment: ${encodeURIComponent(payment)}%0AOrder Note: ${encodeURIComponent(note||"None")}%0A%0APlease confirm the order and share the next payment/order-completion steps.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,"_blank");
};
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).classList.add("hidden"));
if($("footerWhatsapp"))$("footerWhatsapp").textContent=WHATSAPP_NUMBER==="917891582196"?"+91 7891582196":"+"+WHATSAPP_NUMBER;
initHero();renderProducts();renderMoreHome();updateCart();renderCart();
