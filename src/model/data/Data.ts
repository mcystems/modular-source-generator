import {CharacterPosition} from "xml2ts/dist/xmlTsNode";
import {Api} from "model/api/Api";
import {Code} from "model/Code";
import {Index} from "model/data/Index";
import {Field} from "model/data/Field";
import {DomainNameElement} from "model/DomainNameElement";

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
