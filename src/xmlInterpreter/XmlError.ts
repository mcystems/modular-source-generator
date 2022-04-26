import { XmlTsNode } from "xml2ts/dist/xmlTsNode";

export class XmlError extends Error {

  constructor(message: string, node: XmlTsNode) {
    super(JSON.stringify({
      'message': message,
      'xmlElement': node.name,
      'position': node.pos
    }));
  }
}