import {XmlTsNode} from "xml2ts/dist/xmlTsNode";
import {XmlError} from "../xmlInterpreter/XmlError";
import {EnumType, enumValueKeyMapper} from "../utilities";

export function checkAttr<B extends boolean>(attrName: string, node: XmlTsNode, optional: B)
  : B extends true ? string | undefined : string {
  if (!node?.$?.[attrName] && !optional) {
    throw new XmlError(`${attrName} attribute is missing`, node);
  } else {
    return node?.$?.[attrName] as any;
  }
}

export function checkAttrAndWhitespace<B extends boolean>(attrName: string, node: XmlTsNode, optional: B):
  B extends true ? string | undefined : string {
  const val = checkAttr(attrName, node, false);
  if (val.match(/\s/g)) {
    throw new XmlError(`${attrName} attribute must not have whitespace`, node);
  }
  return val as any;
}

export function checkAttrAndValueInEnum<B extends boolean>(attrName: string, node: XmlTsNode, enumeration: EnumType, optional: B):
  B extends true ? string | undefined : string {
  const val = checkAttr(attrName, node, optional);
  const vkMap = enumValueKeyMapper(enumeration);
  if (val) {
    const en = vkMap.get(val);
    if (!en) {
      throw new XmlError(`invalid attribute value`, node);
    }
    return en;
  }
  return undefined as any;
}

export function checkAttrNumeric<B extends boolean>(attrName: string, node: XmlTsNode, optional: B): number | undefined {
  const val = checkAttr(attrName, node, optional);

  // @ts-ignore
  if (val && Number.isNaN(parseInt(val))) {
    throw new XmlError(`${attrName} attribute must be a number`, node);
  } else {
    return val && parseInt(val) || undefined;
  }
}

export function checkAttrAndWhitespaceBoolean<B extends boolean>(attrName: string, node: XmlTsNode, optional: B):
  B extends true ? boolean | undefined : boolean {
  const val = checkAttrAndWhitespace(attrName, node, optional);
  const b = val ? val.toLowerCase() === "true" ? true : val.toLowerCase() === 'false' ? false : undefined : undefined;
  if (!optional) {
    throw new XmlError(`${attrName} is mandatory attribute and value must be true or false`, node);
  }
  return b as any;
}