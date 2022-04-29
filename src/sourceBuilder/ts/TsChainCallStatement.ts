import {MultiStatement} from "../generic/MultiStatement";
import {TsCallStatement} from "./TsCallStatement";
import {Statement} from "../generic/Statement";

class ChainableCallStatement extends TsCallStatement {
  protected terminator: string = "";

  constructor(st: string) {
    super(st);
  }
}


export class TsChainCallStatement extends MultiStatement {
  protected joinString = ".";
  private asynchronous: boolean = false;

  constructor(id?: string) {
    super(undefined, id);
  }

  setAsync(): this {
    this.asynchronous = true;
    return this;
  }

  isAsync(): boolean {
    return this.asynchronous;
  }

  add(name: string, params?: string[]): this {
    const st = new ChainableCallStatement(name);
    params?.forEach(p => st.addParam(new Statement(p)));

    this.addStatement(st);
    return this;
  }

  render(): string {
    const rendering = super.render()
    return `${this.asynchronous ? 'await' : ''} ${rendering};`;
  }
}