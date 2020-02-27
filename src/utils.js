export function hideMenu() {
  $("ytmusic-player-expanding-menu").style.cssText =
    "outline: none; opacity: 0; box-sizing: border-box; max-height: 32px; max-width: 300px; display: none;";
}

export function showMenu() {
  $("ytmusic-player-expanding-menu").style.cssText =
    "outline: none; opacity: 1; box-sizing: border-box; max-height: 32px; max-width: 300px; z-index: 103;";
}

export function observe(element, mutationHandler) {
  const mutationObserver = new MutationObserver(mutations =>
    mutations.forEach(mutationHandler)
  );

  const handler = mutationObserver.observe(element, {
    attributes: true,
    attributeOldValue: true
  });
}