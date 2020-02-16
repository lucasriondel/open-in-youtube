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

  // Contextual menu (WIP)

  //   <ytmusic-menu-navigation-item-renderer
  //     class="style-scope ytmusic-menu-popup-renderer"
  //     role="option"
  //     tabindex="-1"
  //     aria-disabled="false"
  //     aria-selected="false"
  //   >
  //     <a
  //       id="navigation-endpoint"
  //       class="yt-simple-endpoint style-scope ytmusic-menu-navigation-item-renderer"
  //       tabindex="-1"
  //       href=""
  //     >
  //       <yt-icon class="icon style-scope ytmusic-menu-navigation-item-renderer">
  //         <svg
  //           viewBox="0 0 24 24"
  //           preserveAspectRatio="xMidYMid meet"
  //           focusable="false"
  //           class="style-scope yt-icon"
  //           style="pointer-events: none; display: block; width: 100%; height: 100%;"
  //         >
  //           <g class="style-scope yt-icon">
  //             <path
  //               d="M11.7333 8.26667V4L19.2 11.4667L11.7333 18.9333V14.56C6.4 14.56 2.66667 16.2667 0 20C1.06667 14.6667 4.26667 9.33333 11.7333 8.26667Z"
  //               class="style-scope yt-icon"
  //             ></path>
  //           </g>
  //         </svg>
  //       </yt-icon>
  //       <yt-formatted-string class="text style-scope ytmusic-menu-navigation-item-renderer">
  //         Open in YouTube
  //       </yt-formatted-string>
  //     </a>
  //   </ytmusic-menu-navigation-item-renderer>

  const mutationObserver = new MutationObserver(() => {
    const itemsList = document.getElementById("items");

    if (itemsList) {
      const test = document.createElement(
        "ytmusic-menu-navigation-item-renderer"
      );
      test.textContent = "ouais";

      itemsList.appendChild(test);
    }
  });

  mutationObserver.observe(
    document.getElementsByTagName("ytmusic-popup-container")[0],
    {
      childList: true
    }
  );
}

// inject javascript inside a script tag to have access to window.store
const script = document.createElement("script");
script.appendChild(document.createTextNode("(" + main + ")();"));
(document.body || document.head || document.documentElement).appendChild(
  script
);
