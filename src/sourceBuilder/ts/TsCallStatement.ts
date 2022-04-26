import {Statement} from "../generic/Statement";

export class TsCallStatement extends Statement {
  private params: Statement[] = [];
  private asyncronous = false;

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
    this.asyncronous = true;
    return this;
  }

  isAsync(): boolean {
    return this.asyncronous;
  }

  getIdentifier() {
    return super.render();
  }

  render(): string {
    return `${this.asyncronous ? 'await' : ''} ${super.render()}(${this.params.map(param => param.render()).filter(i => i).join(',')});`;
  }
}