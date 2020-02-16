function main() {
  // Right side menu button injection
  const rightSideMenu = document.getElementsByClassName(
    "right-controls-buttons style-scope ytmusic-player-bar"
  );

  const openInYoutubeButton = document.createElement("paper-icon-button");
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

  if (rightSideMenu[0]) {
    rightSideMenu[0].appendChild(openInYoutubeButton);
  }
}

// inject javascript inside a script tag to have access to window.store
const script = document.createElement("script");
script.appendChild(document.createTextNode("(" + main + ")();"));
(document.body || document.head || document.documentElement).appendChild(
  script
);
