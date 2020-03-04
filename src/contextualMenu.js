import { createPaperIconButton, observe } from "./utils";

function getVideoIdFromMenu() {
  const navEndpoint = document.getElementById("navigation-endpoint");
  const urlParams = new URLSearchParams("?" + navEndpoint.href.split("?")[1]);
  return urlParams.get("v");
}

const openInYoutubeButtonAttributes = {
  id: "open-in-youtube-menu-item",
  icon: "icons:exit-to-app",
  title: "Open in YouTube",
  class: "style-scope ytmusic-player-bar",
  "aria-label": "Open in YouTube",
  "aria-disabled": "false"
};

function createMenuItem(iconAttributes, itemText) {
  const div = document.createElement("div");
  div.style =
    "display: flex; align-items: center; height: 48px; padding: 0px 8px;";

  const icon = createPaperIconButton(iconAttributes);
  div.appendChild(icon);

  const text = document.createElement("span");
  text.className = "text style-scope ytmusic-menu-navigation-item-renderer";
  text.innerText = itemText;
  text.text = itemText;
  div.appendChild(text);

  return div;
}

export default function contextualMenu() {
  //  ytmusic-popup-container.style-scope.ytmusic-app
  //    ...
  //        div#contentWrapper
  //            ytmusic-menu-popup-renderer
  //                paper-listbox#items
  //                    ytmusic-menu-navigation-item-renderer[0]
  //                        a#navigation-endpoint -> href = yt music url with videoId in query string
  //                    ytmusic-menu-navigation-item-renderer
  //                    ytmusic-menu-navigation-item-renderer
  //                    ...

  const popupContainer = document.getElementsByTagName(
    "ytmusic-popup-container"
  )[0];
  const menuPopupRenderer = document.getElementsByTagName(
    "ytmusic-menu-popup-renderer"
  );
  let paperListbox = null;
  let init = false;
  let url = null;

  function injectButtonInMenu() {
    const newMenuItem = createMenuItem(
      openInYoutubeButtonAttributes,
      "Open in YouTube"
    );

    newMenuItem.onclick = () =>
      window.open(`https://www.youtube.com/watch?v=${getVideoIdFromMenu()}`);

    paperListbox.appendChild(newMenuItem);
  }

  observe(popupContainer, { childList: true }, m => {
    if (!init) {
      paperListbox = document.getElementById("items");

      observe(
        paperListbox,
        {
          childList: true
        },
        m => {
          let currentHrefValue = document.getElementById("navigation-endpoint")
            .href;
          if (currentHrefValue !== url) {
            if (!url) {
              injectButtonInMenu();
            }
            url = currentHrefValue;
            console.log("url", url);
          }
          // console.dir(m);
        }
      );

      init = true;
    }
  });
}
