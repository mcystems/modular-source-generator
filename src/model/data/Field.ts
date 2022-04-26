import {CharacterPosition} from "xml2ts/dist/xmlTsNode";
import {FieldDataType} from "./FieldDataType";
import {Enumeration} from "./Enumeration";
import {DomainNameFieldElement} from "model/DomainNameElement";

export interface Field extends DomainNameFieldElement {
  dataType: FieldDataType;
  references?: DomainNameFieldElement;
  hint?: string;
  required?: boolean;
  unique?: boolean;
  pos: CharacterPosition;
  minValue?: number;
  maxValue?: number;
  minLength?: number;
  maxLength?: number;
  fixedValues?: Enumeration;
}

