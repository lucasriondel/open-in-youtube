import { observe } from "./utils";

const openInYoutubeButtonAttributes = {
  id: "open-in-youtube-button",
  icon: "icons:exit-to-app",
  title: "Open in YouTube",
  "aria-label": "Open in YouTube",
  "aria-disabled": "false"
};

function injectButtonInPlayerBar(parentElement, attributes) {
  const openInYoutubeButton = document.createElement("paper-icon-button");
  Object.entries(attributes).map(([key, value]) =>
    openInYoutubeButton.setAttribute(key, value)
  );
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

function getIsInMobileMode() {
  return (
    getComputedStyle(
      document.getElementsByClassName(
        "expand-button style-scope ytmusic-player-bar"
      )[0]
    ).display === "block"
  );
}

export default function rightSideMenu() {
  const rightSideMenu = document.getElementsByClassName(
    "right-controls-buttons style-scope ytmusic-player-bar"
  )[0];

  const mobileExpandingMenu = document.getElementById("expanding-menu");

  // we inject this one here because its removal won't be necessary
  injectButtonInPlayerBar(mobileExpandingMenu, openInYoutubeButtonAttributes);

  // fixing width for right controls so the volume slider won't be crused when appearing in wide screen
  document.getElementById("right-controls").style.width = "340px";

  let isInMobileMode = getIsInMobileMode();
  if (!isInMobileMode) {
    injectButtonInPlayerBar(rightSideMenu, openInYoutubeButtonAttributes);
  }

  const resizeObserver = new ResizeObserver(() => {
    const _isInMobileMode = getIsInMobileMode();

    if (_isInMobileMode !== isInMobileMode) {
      isInMobileMode = _isInMobileMode;
      if (_isInMobileMode) {
        document.getElementById("open-in-youtube-button").remove();
      } else {
        injectButtonInPlayerBar(rightSideMenu, openInYoutubeButtonAttributes);
      }
    }
  });
  resizeObserver.observe(document.body);

  // isExpandingMenuHidden
  let isExpandingMenuHidden = document.getElementById("expanding-menu")
    .attributes["aria-hidden"].value;

  observe(
    document.getElementById("expanding-menu"),
    {
      attributes: true,
      attributeOldValue: true
    },
    m => (isExpandingMenuHidden = m.target.attributes["aria-hidden"].value)
  );
}
