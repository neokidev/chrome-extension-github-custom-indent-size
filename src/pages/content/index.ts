import { updateIndentSizeOfLine } from "@pages/content/utils";
import detectIndent from "detect-indent";

console.log("content loaded");

/**
 * @description
 * Chrome extensions don't support modules in content scripts.
 */
import("./components/Demo");

// Inject empty style element for us to use
const style = document.createElement("style");
document.addEventListener("DOMContentLoaded", () =>
  document.body.appendChild(style)
);

// Set tab size styles
const setTabSizeStyles = (size) =>
  (style.innerHTML = `
body {
	--tab-size: ${size};
}
* {
	-moz-tab-size: var(--tab-size) !important;
	     tab-size: var(--tab-size) !important;
}`);

// Set tab size from settings on load
chrome.storage.sync.get(
  {
    tabSize: 8,
  },
  (items) => setTabSizeStyles(items.tabSize)
);

// Update tab style if the setting updates
chrome.storage.onChanged.addListener((items) => {
  if (items.tabSize) {
    setTabSizeStyles(items.tabSize.newValue);
  }
});

chrome.storage.onChanged.addListener((items) => {
  if (items.spaceSize) {
    setSpaceIndent(items.spaceSize.newValue);
  }
});

const setSpaceIndent = async (size: number) => {
  const lineElements = document.getElementsByClassName("blob-code");

  const url = location.href;
  const splitUrl = url.split("/");

  if (splitUrl.length < 8) {
    console.error("Current URL format is incorrect");
    return;
  }

  const content = Array.from(lineElements)
    .map((lineElement) => {
      if (lineElement instanceof HTMLElement) {
        return lineElement.innerText;
      }
      return "";
    })
    .join("\n");

  const indent = detectIndent(content);
  const indentType = indent.type;
  if (indentType === "tab") {
    return;
  }

  const indentSize = indent.amount;

  Array.from(lineElements).forEach((lineElement) => {
    if (lineElement instanceof HTMLElement) {
      updateIndentSizeOfLine(lineElement, indentSize, size);
    }
  });
};

const urlChangeObserver = new MutationObserver(() => {
  console.log("[custom indent] DOM changed!");
  urlChangeObserver.disconnect();
  const lineElements = document.getElementsByClassName("blob-code");
  console.log("[custom indent] lines:", lineElements);

  if (lineElements.length === 0) {
    urlChangeObserver.observe(document, { childList: true, subtree: true });
  } else {
    chrome.storage.sync.get(
      {
        spaceSize: 4,
      },
      (items) => setSpaceIndent(items.spaceSize)
    );
  }
});

urlChangeObserver.observe(document, { childList: true, subtree: true });
