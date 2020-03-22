import {
  createPaperIconButton,
  IPaperIconButtonAttributes,
  observe
} from "./utils";

interface IMetadata {
  videoId: string | null;
  playlistId: string | null;
  [key: string]: string | null;
}

function getMetadataFromMenu() {
  const metadata: IMetadata = {
    videoId: null,
    playlistId: null
  };

  try {
    const navEndpoint = document.getElementById(
      "navigation-endpoint"
    ) as HTMLAnchorElement;

    console.groupCollapsed("contextualMenu:getMetadataFromMenu");
    console.log("navEndpoint", navEndpoint);
    console.groupEnd();

    if (navEndpoint?.href) {
      const urlParams = new URLSearchParams(
        "?" + navEndpoint?.href.split("?")[1]
      );

      metadata.videoId = urlParams.get("v");
      metadata.playlistId = urlParams.get("playlist");

      const prefix = "RDAMPL";
      if (metadata.playlistId?.startsWith(prefix)) {
        metadata.playlistId = metadata.playlistId.slice(prefix.length);
      }
    }
  } finally {
    return metadata;
  }
}

function metadataToUrl({ playlistId, videoId }: IMetadata) {
  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  } else if (playlistId) {
    return `https://www.youtube.com/playlist?list=${playlistId}`;
  }
}

const openInYoutubeButtonAttributes: IPaperIconButtonAttributes = {
  id: "open-in-youtube-menu-item",
  icon: "icons:exit-to-app",
  title: "Open in YouTube",
  "aria-label": "Open in YouTube",
  "aria-disabled": "false"
};

const copyURLToClipboardButtonAttributes: IPaperIconButtonAttributes = {
  id: "copy-url-to-clipboard-menu-item",
  icon: "icons:content-copy",
  title: "Copy URL to clipboard",
  "aria-label": "Copy URL to clipboard",
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
  div.style.cursor = "pointer";
  div.className = "style-scope ytmusic-menu-popup-renderer";

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
  //    iron-dropdown
  //      ...
  //          div#contentWrapper
  //              ytmusic-menu-popup-renderer
  //                  paper-listbox#items
  //                      ytmusic-menu-navigation-item-renderer[0]
  //                          a#navigation-endpoint -> href = yt music url with videoId in query string
  //                      ytmusic-menu-navigation-item-renderer
  //                      ytmusic-menu-navigation-item-renderer
  //                      ...

  const popupContainer = document.getElementsByTagName(
    "ytmusic-popup-container"
  )[0] as HTMLElement;
  if (!popupContainer) throw new Error(`popupContainer is undefined`);

  let ironDropdown: HTMLElement | null = null;

  let paperListbox: HTMLElement | null = null;
  let init = false;
  let metadata: ReturnType<typeof getMetadataFromMenu> = {
    videoId: null,
    playlistId: null
  };

  function hasMetadata() {
    return !!Object.keys(metadata).find(key => metadata[key]);
  }

  function injectButtonInMenu(
    buttonAttributes: IPaperIconButtonAttributes,
    buttonText: string,
    onClick: () => void
  ) {
    const newMenuItem = createMenuItem(buttonAttributes, buttonText);

    newMenuItem.onclick = onClick;

    paperListbox!.appendChild(newMenuItem);
  }

  function hideMenu() {
    if (ironDropdown) {
      ironDropdown.style.display = "none";
      ironDropdown.setAttribute("aria-hidden", "true");
    }
  }

  console.groupCollapsed("contextualMenu:init");
  console.log("popupContainer element", popupContainer);
  console.log("watching popupContainer for childList changes...");
  console.groupEnd();

  observe(popupContainer, { childList: true }, m => {
    if (!init) {
      paperListbox = document.getElementById("items");
      if (!paperListbox) throw new Error(`paperListbox is undefined`);

      ironDropdown = document.getElementsByTagName(
        "iron-dropdown"
      )[0] as HTMLElement;

      console.groupCollapsed("contextualMenu:popupContainerObserver");
      console.log("mutation", m);
      console.log("target", m.target);
      console.log("paperListbox", paperListbox);
      console.log("ironDropdown", ironDropdown);
      console.groupEnd();

      observe(
        ironDropdown,
        {
          attributes: true,
          attributeFilter: ["aria-hidden"]
        },
        m => {
          const ironDropdownHidden =
            (m.target as HTMLElement).getAttribute("aria-hidden") === "true";

          metadata = getMetadataFromMenu();

          console.groupCollapsed("contextualMenu:ironDropdownObserver");
          console.log("mutation", m);
          console.log("target", m.target);
          console.log("ironDropdownHidden", ironDropdownHidden);
          console.log("getMetadataFromMenu()", metadata);
          console.log("hasMetadata()", hasMetadata());
          console.groupEnd();

          if (ironDropdownHidden) {
          } else if (hasMetadata()) {
            injectButtonInMenu(
              openInYoutubeButtonAttributes,
              "Open in YouTube",
              () => window.open(metadataToUrl(metadata))
            );

            injectButtonInMenu(
              copyURLToClipboardButtonAttributes,
              "Copy URL to clipboard",
              () => {
                navigator.clipboard.writeText(metadataToUrl(metadata)!);
                hideMenu();
              }
            );
          }
        }
      );

      init = true;
    }
  });
}
