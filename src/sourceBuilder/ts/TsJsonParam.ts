import {Statement} from "../generic/Statement";

export class TsJsonParam extends Statement {

  private parts: Map<string, string | TsJsonParam> = new Map();

  constructor(id?: string) {
    super(undefined, id);
  }

  setParts(parts: [string, string][]): this {
    this.parts = new Map(parts);
    return this;
  }

  addParts(key: string, value: string | TsJsonParam): this {
    this.parts.set(key, value);
    return this;
  }

  size(): number {
    return this.parts.size;
  }

  render(): string {
    if (this.parts.size > 0) {
      let jsonString = '{';
      jsonString += Array.from(this.parts.entries()).map((e: [string, string | TsJsonParam]) => {
        if (e[0] === e[1]) {
          return e[0];
        } else if (e[1] instanceof TsJsonParam) {
          return `${e[0]}: ${e[1].render()}`
        } else {
          return `${e[0]}: ${e[1]}`
        }
      }).join(',');
      jsonString += '}';
      return jsonString;
    } else {
      return '';
    }
  }
}