(() => {
  const urls = {
    chrome: "https://chromewebstore.google.com/detail/click-repeater/ojdgninjdijhhclanjlhaipehopjjmoo",
    firefox: "https://addons.mozilla.org/firefox/addon/click-repeater/"
  };
  const status = document.getElementById("recommend-status");
  function button(icon, label) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "recommend-icon-button";
    item.innerHTML = icon;
    item.dataset.tooltip = label;
    item.setAttribute("aria-label", label);
    return item;
  }
  function mount() {
    for (const row of document.querySelectorAll(".recommend-store-row")) {
      const url = urls[row.dataset.store];
      const actions = row.querySelector(".recommend-store-actions");
      const open = button(iconSet.externalLink, t("recommendOpenAction"));
      open.addEventListener("click", () => window.open(url, "_blank", "noopener,noreferrer"));
      const copy = button(iconSet.copy, t("recommendCopyAction"));
      copy.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(url); status.textContent = t("recommendCopied"); }
        catch { status.textContent = t("recommendCopyFailed"); }
      });
      const share = button(iconSet.share, t("recommendShareAction"));
      share.addEventListener("click", async () => {
        if (typeof navigator.share !== "function") {
          try { await navigator.clipboard.writeText(url); status.textContent = t("recommendCopied"); }
          catch { status.textContent = t("recommendShareFailed"); }
          return;
        }
        try { await navigator.share({ title: "Click Repeater", text: t("recommendShareMessage"), url }); }
        catch (error) { if (error?.name !== "AbortError") status.textContent = t("recommendShareFailed"); }
      });
      actions.replaceChildren(open, copy, share);
    }
  }
  globalThis.syncRecommendPage = mount;
  mount();
})();
