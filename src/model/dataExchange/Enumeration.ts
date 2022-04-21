import {DomainNameElement} from "./DomainNameElement";

export type EnumerationType = string | number;

export interface Enumeration<T extends EnumerationType> extends DomainNameElement {
  values: T[];
}
