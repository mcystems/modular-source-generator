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

export type EnumType = { [s: string]: string };

export function enumValueKeyMapper(enumeration: EnumType): Map<string, string> {
  return new Map(Object.entries(enumeration).map(e=> {
    return [e[1], enumeration[e[0]]];
  }));
}