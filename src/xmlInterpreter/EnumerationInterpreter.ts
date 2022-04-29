import {XmlTsNode} from "xml2ts/dist/xmlTsNode";
import {Enumeration, EnumerationValue} from "../model/data/Enumeration";
import {checkAttrAndWhitespace} from "../xmlInterpreter/Interpreter";
import {forceArray} from "../utilities";
import {DomainNameElement, domainNameOf} from "../model/DomainNameElement";

export class EnumerationInterpreter {
  static interpret(node: XmlTsNode): Enumeration {
    const domain = checkAttrAndWhitespace('domain', node, false);
    const name = checkAttrAndWhitespace('name', node, false);

    return {
      domain,
      name,
      values: EnumerationInterpreter.interpretValues({domain, name}, forceArray(node.value))
    }
  }

  static interpretValues(d: DomainNameElement, node: XmlTsNode[]): EnumerationValue[] {
    return node.map(n => {
      const key = checkAttrAndWhitespace('key', n, false);
      return {
        key,
        value: `${domainNameOf(d)}.${key}`
      }
    })
  }
}