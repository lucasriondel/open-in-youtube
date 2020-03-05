import {
  createPaperIconButton,
  IPaperIconButtonAttributes,
  observe
} from "./utils";

function getVideoIdFromMenu() {
  const navEndpoint = document.getElementById(
    "navigation-endpoint"
  ) as HTMLAnchorElement;
  if (navEndpoint?.href) {
    const urlParams = new URLSearchParams(
      "?" + navEndpoint?.href.split("?")[1]
    );
    return urlParams.get("v");
  }
  return null;
}

const openInYoutubeButtonAttributes: IPaperIconButtonAttributes = {
  id: "open-in-youtube-menu-item",
  icon: "icons:exit-to-app",
  title: "Open in YouTube",
  class: "style-scope ytmusic-player-bar",
  "aria-label": "Open in YouTube",
  "aria-disabled": "false"
};

function createMenuItem(
  paperIconAttributes: IPaperIconButtonAttributes,
  itemText: string
) {
  const div = document.createElement("div");
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.height = "48px";
  div.style.padding = "0px 8px";
  // div.style =
  //   "display: flex; align-items: center; height: 48px; padding: 0px 8px;";

  const icon = createPaperIconButton(paperIconAttributes);
  div.appendChild(icon);

  const text = document.createElement("span");
  text.className = "text style-scope ytmusic-menu-navigation-item-renderer";
  text.innerText = itemText;
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
  )[0] as HTMLElement;

  if (!popupContainer) throw new Error(`popupContainer is undefined`);

  let paperListbox: HTMLElement | null = null;
  let init = false;
  let videoId: string | null;

  function injectButtonInMenu() {
    const newMenuItem = createMenuItem(
      openInYoutubeButtonAttributes,
      "Open in YouTube"
    );

    newMenuItem.onclick = () =>
      window.open(`https://www.youtube.com/watch?v=${videoId}`);

    paperListbox!.appendChild(newMenuItem);
  }

  observe(popupContainer, { childList: true }, m => {
    if (!init) {
      paperListbox = document.getElementById("items");

      if (!paperListbox) throw new Error(`paperListbox is undefined`);

      observe(
        paperListbox,
        {
          childList: true
        },
        m => {
          let currentVideoId = getVideoIdFromMenu();

          if (currentVideoId !== videoId) {
            injectButtonInMenu();
            videoId = currentVideoId;
            console.log("videoId", videoId);
          }
        }
      );

      init = true;
    }
  });
}
