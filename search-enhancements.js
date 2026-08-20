(function () {
  "use strict";

  var mainCount = Array.isArray(window.AURA_PRODUCTS) ? window.AURA_PRODUCTS.length : 0;
  var moreCount = Array.isArray(window.AURA_MORE_PRODUCTS) ? window.AURA_MORE_PRODUCTS.length : 0;
  var totalProducts = mainCount + moreCount;
  var quickSearches = [
    ["All", ""],
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

  function enhanceCatalog() {
    enhancementScheduled = false;
    var input = document.getElementById("catalog-search");
    var tools = document.querySelector(".catalog-tools");
    if (!input || !tools) return;

    input.placeholder = "Search " + totalProducts + " styles by name, colour or fabric…";
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
