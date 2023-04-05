const enum CharCode {
  Space = 32,
}

export const fetchRawFileContent = async (
  repo: string,
  branch: string,
  path: string
): Promise<string> => {
  const uri = `https://raw.githubusercontent.com/${repo}/${branch}/${path}`;

  return await fetch(encodeURI(uri)).then((response) => {
    if (!response.ok) throw Error(`Failed to fetch content from ${uri}`);
    return response.text();
  });
};

const isOnlySpaces = (str: string) => {
  return str.trim().length === 0;
};

export const isNodeOnlySpaces = (node: Node) => {
  if (node.nodeType !== Node.TEXT_NODE) {
    return false; // テキストノードでなければfalseを返す
  }
  return isOnlySpaces(node.textContent);
};

export const isTextNode = (node: Node) => {
  return node.nodeType === Node.TEXT_NODE;
};

const countIndentSpaces = (text: string) => {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) !== CharCode.Space) {
      break;
    }
    count++;
  }
  return count;
};

export const countIndentSpacesOfLine = (lineElement: HTMLElement) => {
  const firstChild = lineElement.firstChild;
  if (isTextNode(firstChild)) {
    return countIndentSpaces(firstChild.textContent);
  }
  return 0;
};

export const updateIndentSizeOfLine = (
  lineElement: HTMLElement,
  originalSize: number,
  newSize: number
) => {
  const firstChild = lineElement.firstChild;
  if (!isTextNode(firstChild)) {
    return lineElement;
  }

  const currentIndentSpaces = countIndentSpacesOfLine(lineElement);
  const indentLevel = Math.floor(currentIndentSpaces / originalSize);
  const remainingIndentSpaces = currentIndentSpaces % originalSize;

  console.log(
    "indentSpaces:",
    lineElement,
    currentIndentSpaces,
    newSize * indentLevel + remainingIndentSpaces,
    firstChild.textContent.substring(currentIndentSpaces),
    firstChild.textContent.substring(currentIndentSpaces).length
  );
  firstChild.textContent =
    " ".repeat(newSize * indentLevel + remainingIndentSpaces) +
    firstChild.textContent.substring(currentIndentSpaces);

  return lineElement;
};
