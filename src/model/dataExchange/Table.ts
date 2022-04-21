import {CharacterPosition} from "xml2ts/dist/xmlTsNode";
import {Api} from "model/api/Api";
import {Code} from "model/Code";
import {Index} from "model/dataExchange/Index";
import {DataExchange} from "model/dataExchange/DataExchange";

export interface Table extends DataExchange {
  code: Code[];
  noRoles: boolean;
  api: Api;
  indexes: Index[];
  pos: CharacterPosition;
}
