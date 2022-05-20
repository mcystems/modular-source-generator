import {CharacterPosition} from "xml2ts/dist/xmlTsNode";
import {Api} from "../api/Api";
import {Code} from "../Code";
import {Index} from "./Index";
import {Field} from "./Field";
import {DomainNameElement} from "../DomainNameElement";

export enum DataType {
  TABLE = 'table', VIEW = 'view'
}

export interface Data extends DomainNameElement {
  type: DataType;
  fields: Field[];
  code: Code[];
  noRoles: boolean;
  api?: Api;
  indexes: Index[];
  pos: CharacterPosition;
}
