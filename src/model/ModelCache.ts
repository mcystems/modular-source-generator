import {Data} from "model/data/Data";
import {Field} from "model/data/Field";
import {Enumeration} from "model/data/Enumeration";
import {DomainNameElement, domainNameOf} from "model/DomainNameElement";

let instance: ModelCache | undefined;

export class ModelCache {

  readonly dataByDomainName: Map<string, Data> = new Map();
  readonly fieldByDomainDataFieldName: Map<string, Field> = new Map();
  readonly enumerationByName: Map<string, Enumeration> = new Map();
  readonly idFieldOfData: Map<string, string> = new Map();

  static getInstance(): ModelCache {
    if (!instance) {
      instance = new ModelCache();
    }
    return instance;
  }

  setDataByDomainName(domainName: string, data: Data): void {
    this.dataByDomainName.set(domainName, data);
  }

  getDataByDomainName(s: string): Data | undefined {
    return this.dataByDomainName.get(s);
  }

  getFieldByDomainDataFieldName(s: string): Field | undefined {
    return this.fieldByDomainDataFieldName.get(s);
  }

  setFieldByDomainDataFieldName(ddf: string, f: Field) {
    this.fieldByDomainDataFieldName.set(ddf, f);
  }

  setEnumerationByName(name: string, e: Enumeration): void {
    this.enumerationByName.set(name, e);
  }

  getEnumerationByName(name: string): Enumeration | undefined {
    return this.enumerationByName.get(name);
  }

  setIdFieldNameOfData(d: DomainNameElement, idFieldName: string) {
    this.idFieldOfData.set(domainNameOf(d), idFieldName);
  }

  getIdFieldNameOfData(d: DomainNameElement): string | undefined {
    return this.idFieldOfData.get(domainNameOf(d));
  }
}

