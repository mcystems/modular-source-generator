import fse from "fs-extra";
import {detect} from "chardet";
import {Parser} from "xml2ts/dist/parser"
import {parserDefaults} from "xml2ts/dist/defaults"
import {XmlTsNode} from "xml2ts/dist/xmlTsNode";
import {DataInterpreter} from "../xmlInterpreter/DataInterpreter";
import {ModelCache} from "../model/ModelCache";
import {XmlError} from "../xmlInterpreter/XmlError";
import path from "path";
import {EnumerationInterpreter} from "../xmlInterpreter/EnumerationInterpreter";
import {domainNameOf} from "../model/DomainNameElement";
import {PreferencesInterpreter} from "../xmlInterpreter/PreferencesInterpreter";
import {ProjectBuilder} from "../generator/ProjectBuilder";

const parserOptions = {
  ...parserDefaults,
  explicitArray: false,
  explicitChildren: true,
  preserveChildrenOrder: true
}

export class GeneratorXmlInterpreter {
  static async interpret(xmlFile: string) {
    const node: XmlTsNode = await new GeneratorXmlInterpreter().parseXml(xmlFile);
    const modelCache = ModelCache.getInstance();
    const projectBuilder = ProjectBuilder.getInstance();
    for (let i of node.$$ || []) {
      switch (i.name) {
        case "data": {
          const data = DataInterpreter.interpret(i);
          const exists = modelCache.getDataByDomainName(domainNameOf(data));
          if (exists !== undefined) {
            throw new XmlError(`data is already defined`, i);
          }
          modelCache.setDataByDomainName(domainNameOf(data), data);
          data.fields.forEach(f => modelCache.setFieldByDomainDataFieldName(`${domainNameOf(data)}.${f.name}`, f));
          projectBuilder.fireDataEvent(data);
          break;
        }
        case "import":
          if (!i?.$?.file) {
            throw new XmlError(`file attribute is missing`, i);
          }
          await GeneratorXmlInterpreter.interpret(path.join(__dirname, i.$.file));
          break;
        case "enum": {
          const e = EnumerationInterpreter.interpret(i);
          modelCache.setEnumerationByName(domainNameOf(e), e);

          projectBuilder.fireEnumerationEvent(e);
          break;
        }
        case "preferences":
          const pref = PreferencesInterpreter.interpret(i);
          modelCache.setPreferences(pref);
          break;
        default:
          throw new XmlError(`unknown xml tag`, i);
      }
    }

  }

  async parseXml(xmlFile: string): Promise<XmlTsNode> {
    const xmlBuffer: Buffer = await fse.readFile(xmlFile);
    const charset = detect(xmlBuffer);
    if (charset == null) {
      throw new Error(`can not determine ${xmlFile} encoding`);
    }
    let node: XmlTsNode | null;
    switch (charset) {
      case 'ascii' :
      case 'utf8':
      case 'utf-8':
      case 'utf16le':
      case 'ucs2':
      case 'ucs-2':
      case 'base64':
      case 'base64url':
      case 'latin1':
      case 'binary':
      case 'hex':
        node = await new Parser(parserOptions).parseString(xmlBuffer.toString(charset));
        break;
      default:
        throw new Error(`unsupported file encoding: ${charset}`);
    }
    if (!node) {
      throw new Error(`can not parse given xml file`);
    }
    return node;
  }
}
