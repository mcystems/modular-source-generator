import {CharacterPosition} from "xml2ts/dist/xmlTsNode";
import {FieldDataType} from "./FieldDataType";
import {DomainNameElement} from "./DomainNameElement";
import {Enumeration, EnumerationType} from "./Enumeration";

export interface Field {
  name: string;
  dataType: FieldDataType;
  references?: DomainNameElement;
  hint?: string;
  required?: boolean;
  unique?: boolean;
  pos: CharacterPosition;
  minValue?: number;
  maxValue?: number;
  minLength?: number;
  maxLength?: number;
  fixedValues?: Enumeration<EnumerationType>;
}

