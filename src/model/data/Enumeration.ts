import {DomainNameElement} from "../../model/DomainNameElement";

export type EnumerationValue = { key: string, value: string };

export interface Enumeration extends DomainNameElement {
  values: EnumerationValue[];
}
