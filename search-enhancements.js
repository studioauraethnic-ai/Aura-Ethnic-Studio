(function () {
  "use strict";

  var mainCount = Array.isArray(window.AURA_PRODUCTS) ? window.AURA_PRODUCTS.length : 0;
  var moreCount = Array.isArray(window.AURA_MORE_PRODUCTS) ? window.AURA_MORE_PRODUCTS.length : 0;
  var totalProducts = mainCount + moreCount;
  var quickSearches = [
    ["All", ""],
    ["Swati Rathi", "swati rathi"],
    ["Kurta Sets", "kurta set"],
    ["Long Kurta", "long kurta"],
    ["Short Kurta", "short kurta"],
    ["Modal Cotton", "modal cotton"],
    ["Georgette", "georgette"],
    ["Mulmul", "mulmul"],
    ["Rayon", "rayon"],
    ["Pink", "pink"],
    ["Black", "black"]
  ];
  var enhancementScheduled = false;

  function setReactInputValue(input, value) {
    var descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
    if (descriptor && descriptor.set) {
      descriptor.set.call(input, value);
    } else {
      input.value = value;
    }
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function updateControls(input, clearButton, chipButtons) {
    var query = input.value.trim().toLowerCase();
    clearButton.hidden = query.length === 0;
    chipButtons.forEach(function (button) {
      button.classList.toggle("is-active", button.dataset.query === query);
    });
  }

  function makeQuickSearch(input, clearButton) {
    var bar = document.createElement("div");
    var label = document.createElement("span");
    var list = document.createElement("div");

    bar.className = "aura-quick-search";
    bar.setAttribute("aria-label", "Popular product searches");
    label.className = "aura-quick-search-label";
    label.textContent = "Quick find";
    list.className = "aura-quick-search-list";

    quickSearches.forEach(function (item) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "aura-search-chip";
      button.dataset.query = item[1];
      button.textContent = item[0];
      button.addEventListener("click", function () {
        setReactInputValue(input, item[1]);
        updateControls(input, clearButton, Array.from(list.children));
        var collection = document.querySelector(".collection");
        if (collection) {
          collection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      list.appendChild(button);
    });

    bar.appendChild(label);
    bar.appendChild(list);
    updateControls(input, clearButton, Array.from(list.children));
    return bar;
  }

  function enhanceImages() {
    document.querySelectorAll(".product-media img").forEach(function (image) {
      if (!image.hasAttribute("loading")) image.loading = "lazy";
      if (!image.hasAttribute("decoding")) image.decoding = "async";
    });
  }

  function makeFilterToggle(tools) {
    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "aura-mobile-filter-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "FILTERS";
    toggle.addEventListener("click", function () {
      var isOpen = tools.classList.toggle("filters-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.textContent = isOpen ? "CLOSE" : "FILTERS";
    });
    return toggle;
  }

  function makeReviewSection() {
    var section = document.createElement("section");
    section.id = "reviews";
    section.className = "aura-reviews section";
    section.innerHTML = [
      '<div class="aura-review-heading">',
      '<p class="eyebrow">CUSTOMER REVIEWS</p>',
      '<h2>Real experiences.<br><em>Shared honestly.</em></h2>',
      '<p>Aura publishes feedback only from confirmed customers. No copied testimonials, no made-up ratings—just genuine experiences after delivery.</p>',
      '<span class="aura-review-pill">VERIFIED ORDERS ONLY</span>',
      '</div>',
      '<div class="aura-review-body">',
      '<div class="aura-review-standards">',
      '<article><span>01</span><small>CONFIRMED ORDER</small><h3>Reviews are verified</h3><p>We match feedback with a completed Aura order before it appears in the gallery.</p></article>',
      '<article><span>02</span><small>PHOTO REVIEWS</small><h3>Show the real fit</h3><p>Customers can share an optional product photo along with fabric, colour and fitting feedback.</p></article>',
      '<article><span>03</span><small>HONEST EXPERIENCE</small><h3>Your words stay yours</h3><p>We publish genuine feedback without changing its meaning—positive or constructive.</p></article>',
      '</div>',
      '<div class="aura-review-callout">',
      '<div><span class="aura-review-stars" aria-hidden="true">☆ ☆ ☆ ☆ ☆</span><strong>Purchased from Aura?</strong><p>Share your honest review after delivery. Add the product name, size and an optional photo.</p></div>',
      '<a href="https://wa.me/917357924991?text=Hello%20Aura%20Ethnic%20Studio%2C%20I%20would%20like%20to%20share%20my%20honest%20product%20review." target="_blank" rel="noopener">SHARE YOUR REVIEW <span>→</span></a>',
      '</div>',
      '</div>'
    ].join("");
    return section;
  }

  function ensureReviewSection() {
    if (document.getElementById("reviews")) return;
    var editorial = document.querySelector(".editorial");
    var policies = document.querySelector(".policies");
    if (editorial) {
      editorial.insertAdjacentElement("afterend", makeReviewSection());
    } else if (policies) {
      policies.insertAdjacentElement("beforebegin", makeReviewSection());
    }
  }

  function enhanceCatalog() {
    enhancementScheduled = false;
    ensureReviewSection();
    var input = document.getElementById("catalog-search");
    var tools = document.querySelector(".catalog-tools");
    if (!input || !tools) return;

    input.placeholder = window.matchMedia("(max-width: 760px)").matches
      ? "Search " + totalProducts + " styles…"
      : "Search " + totalProducts + " styles by name, colour or fabric…";
    input.setAttribute("aria-label", "Search all " + totalProducts + " Aura Ethnic Studio products");
    input.setAttribute("autocomplete", "off");
    input.setAttribute("enterkeyhint", "search");

    var searchField = input.closest(".search-field") || input.parentElement;
    var clearButton = searchField.querySelector(".aura-search-clear");
    if (!clearButton) {
      clearButton = document.createElement("button");
      clearButton.type = "button";
      clearButton.className = "aura-search-clear";
      clearButton.setAttribute("aria-label", "Clear product search");
      clearButton.title = "Clear search";
      clearButton.textContent = "×";
      clearButton.addEventListener("click", function () {
        setReactInputValue(input, "");
        input.focus({ preventScroll: true });
        scheduleEnhancement();
      });
      searchField.appendChild(clearButton);
    }

    var shortcut = searchField.querySelector(".aura-search-shortcut");
    if (!shortcut) {
      shortcut = document.createElement("span");
      shortcut.className = "aura-search-shortcut";
      shortcut.setAttribute("aria-hidden", "true");
      shortcut.textContent = "/";
      searchField.appendChild(shortcut);
    }

    var quickBar = document.querySelector(".aura-quick-search");
    if (!quickBar) {
      quickBar = makeQuickSearch(input, clearButton);
      tools.insertAdjacentElement("afterend", quickBar);
    }

    var filterToggle = tools.querySelector(".aura-mobile-filter-toggle");
    if (!filterToggle) {
      tools.appendChild(makeFilterToggle(tools));
    }

    var chips = Array.from(quickBar.querySelectorAll(".aura-search-chip"));
    updateControls(input, clearButton, chips);
    enhanceImages();
  }

  function scheduleEnhancement() {
    if (enhancementScheduled) return;
    enhancementScheduled = true;
    window.requestAnimationFrame(enhanceCatalog);
  }

  document.addEventListener("keydown", function (event) {
    var target = event.target;
    var typing = target && (
      /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable
    );
    if (event.key === "/" && !typing) {
      var input = document.getElementById("catalog-search");
      if (input) {
        event.preventDefault();
        input.focus();
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });

  document.addEventListener("input", function (event) {
    if (event.target && event.target.id === "catalog-search") {
      scheduleEnhancement();
    }
  });

  var observer = new MutationObserver(scheduleEnhancement);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleEnhancement, { once: true });
  } else {
    scheduleEnhancement();
  }
})();
