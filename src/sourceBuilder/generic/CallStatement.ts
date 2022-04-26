import {Statement} from "../generic/Statement";

export class CallStatement extends Statement {
  private params: Statement[] = [];
  private asynchronous: boolean = false;

  constructor(private readonly cmdWithoutParam: string, private readonly terminator: string = ';') {
    super(cmdWithoutParam);
  }

  setAsynchronous(asynchronous: boolean = true): this {
    this.asynchronous = asynchronous;
    return this;
  }

  addParam(param: Statement): this {
    this.params.push(param);
    return this;
  }

  render(): string {
    return `${this.asynchronous ? 'await ' : ''}${super.render()}(${this.params.map(param => param.render()).filter(i => i).join(',')})${this.terminator}`;
  }
}