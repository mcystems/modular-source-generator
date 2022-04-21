import {DomainNameElement} from "./DomainNameElement";
import {IdType} from "./IdType";
import {Field} from "./Field";

export interface DataExchange extends DomainNameElement {
  idType: IdType;
  field: Field[];
}