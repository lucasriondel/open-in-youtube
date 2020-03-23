// export function hideMenu() {
//   $("ytmusic-player-expanding-menu").style.cssText =
//     "outline: none; opacity: 0; box-sizing: border-box; max-height: 32px; max-width: 300px; display: none;";
// }

// export function showMenu() {
//   $("ytmusic-player-expanding-menu").style.cssText =
//     "outline: none; opacity: 1; box-sizing: border-box; max-height: 32px; max-width: 300px; z-index: 103;";
// }

export function observe(
  element: HTMLElement,
  options: MutationObserverInit,
  mutationHandler: (mutation: MutationRecord) => void
) {
  const mutationObserver = new MutationObserver(mutations => {
    mutations.forEach(mutationHandler);
  });

  const handler = mutationObserver.observe(element, options);
}

export interface IPaperIconButtonAttributes {
  id?: string;
  icon?: string;
  title?: string;
  class?: string;
  "aria-label"?: string;
  "aria-disabled"?: string;
}

export function createPaperIconButton(attributes: IPaperIconButtonAttributes) {
  const openInYoutubeButton = document.createElement("paper-icon-button");
  Object.entries(attributes).map(([key, value]) =>
    openInYoutubeButton.setAttribute(key, value)
  );
  return openInYoutubeButton;
}
