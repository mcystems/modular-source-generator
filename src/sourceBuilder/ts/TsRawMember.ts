import {Statement} from "../generic/Statement";

export class TsRawMember extends Statement {
  constructor(def: string, id?: string) {
    super(def);
  }
}