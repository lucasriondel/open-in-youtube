import { observe } from "./utils";

export default function rightSideMenu() {
  function injectButtonInPlayerBar(parentElement) {
    const openInYoutubeButton = document.createElement("paper-icon-button");
    openInYoutubeButton.setAttribute("id", "open-in-youtube-button");
    openInYoutubeButton.setAttribute("icon", "icons:exit-to-app");
    openInYoutubeButton.setAttribute("title", "Open in YouTube");
    openInYoutubeButton.setAttribute("aria-label", "Open in YouTube");
    openInYoutubeButton.setAttribute("aria-disabled", "false");
    openInYoutubeButton.className = "style-scope ytmusic-player-bar";

    openInYoutubeButton.onclick = () => {
      const state = window.store.getState();

      window.open(
        `https://www.youtube.com/watch?v=${state.player.playerResponse.videoDetails.videoId}`
      );
    };

    if (parentElement) {
      parentElement.appendChild(openInYoutubeButton);
    }
  }

  const rightSideMenu = document.getElementsByClassName(
    "right-controls-buttons style-scope ytmusic-player-bar"
  )[0];

  const mobileExpandingMenu = document.getElementById("expanding-menu");

  // we inject this one here because its removal won't be necessary
  injectButtonInPlayerBar(mobileExpandingMenu);

  // fixing width for right controls so the volume slider won't be crused when appearing in wide screen
  document.getElementById("right-controls").style.width = "340px";

  function getIsInMobileMode() {
    return (
      getComputedStyle(
        document.getElementsByClassName(
          "expand-button style-scope ytmusic-player-bar"
        )[0]
      ).display === "block"
    );
  }

  let isInMobileMode = getIsInMobileMode();
  if (!isInMobileMode) {
    injectButtonInPlayerBar(rightSideMenu);
  }

  const resizeObserver = new ResizeObserver(() => {
    const _isInMobileMode = getIsInMobileMode();

    if (_isInMobileMode !== isInMobileMode) {
      isInMobileMode = _isInMobileMode;
      if (_isInMobileMode) {
        document.getElementById("open-in-youtube-button").remove();
      } else {
        injectButtonInPlayerBar(rightSideMenu);
      }
    }
  });
  resizeObserver.observe(document.body);

  // isExpandingMenuHidden
  let isExpandingMenuHidden = document.getElementById("expanding-menu")
    .attributes["aria-hidden"].value;

  observe(
    document.getElementById("expanding-menu"),
    m => (isExpandingMenuHidden = m.target.attributes["aria-hidden"].value)
  );
}
