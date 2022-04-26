import {XmlTsNode} from "xml2ts/dist/xmlTsNode";

export function forceArray(node: XmlTsNode | XmlTsNode[] | undefined): XmlTsNode[] {
  if (!node) {
    return [];
  }
  if (!Array.isArray(node)) {
    return [node];
  }
  return node;
}
