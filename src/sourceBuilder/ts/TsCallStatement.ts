import {Statement} from "../generic/Statement";

export class TsCallStatement extends Statement {
  private params: Statement[] = [];
  private asynchronous = false;

  protected terminator = ";"

  constructor(st: string, id?: string) {
    super(st, id);
  }

  addParam(param: Statement): this {
    this.params.push(param);
    return this;
  }

  getParams(): Statement[] {
    return this.params;
  }

  setAsync(): this {
    this.asynchronous = true;
    return this;
  }

  isAsync(): boolean {
    return this.asynchronous;
  }

  getIdentifier() {
    return super.render();
  }

  setTerminator(t: string): this {
    this.terminator= t;
    return this;
  }

  render(): string {
    return `${this.asynchronous ? 'await ' : ''}${super.render()}(${this.params.map(param => param.render()).filter(i => i).join(',')})${this.terminator}`;
  }
}
