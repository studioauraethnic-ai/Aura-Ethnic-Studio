AURA ETHNIC STUDIO — FINAL PREMIUM WEBSITE

Files:
- index.html = main website
- style.css = design/responsive CSS
- script.js = website/cart/checkout logic
- products-data.js = product catalog
- admin.html = product manager
- hero-new-arrivals.webp / hero-editorial.png / kurti-01.jpg = sample images

PRODUCTS:
Open admin.html to add products. Add name, fabric, badge, description and 1–5 photos. Then download products-data.js and replace the existing products-data.js beside index.html.

WHATSAPP:
Open script.js and replace 91XXXXXXXXXX with your real WhatsApp number.

PRICING:
1 set ₹500, 2 sets ₹800, 3 sets ₹1000. Shipping ₹0 for every order. Delivery 3–4 days. COD is not available.

NOTE:
The product manager exports a static JS catalog because this website has no server/database. This means no paid backend is required, and the website works on mobile, tablet and PC. For true online admin updates without replacing a file, a backend/database would be required.


UPDATED FEATURES:
- Added a separate "More Styles" collection and full page: more-products.html.
- In admin.html, choose Main Kurtis or More Styles when adding a product.
- Product cards now show MRP, ₹500 selling price, and the calculated discount percentage.
- Existing bundle pricing remains unchanged: 1 set ₹500, 2 sets ₹800, 3 sets ₹1000.
- Admin exports both collections into the same products-data.js file.


MORE STYLES:
- Separate product catalog file: more-products-data.js
- Add/edit More Styles products in that file without touching products-data.js.
- more-products.html loads both catalogs and uses the same cart/WhatsApp checkout.
- Two demo More Styles products are included so you can copy the object format.

MORE STYLES FIX:
- more-products-data.js is the single source of truth for More Styles.
- index.html loads both products-data.js and more-products-data.js.
- Homepage More Styles cards and more-products.html use the exact same More Styles data.
- Admin exports products-data.js and more-products-data.js separately.
