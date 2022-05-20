import {MultiStatement} from "../generic/MultiStatement";
import {TsCallStatement} from "./TsCallStatement";
import {Statement} from "../generic/Statement";
import {forceArray} from "../../utilities";

export class TsChainableCallStatement extends TsCallStatement {
  protected terminator: string = "";

  constructor(st: string) {
    super(st);
  }
}


export class TsChainCallStatement extends MultiStatement {
  private asynchronous: boolean = false;

  constructor(id?: string) {
    super(undefined, id);
    this.setJoinString(".");
  }

  setAsync(): this {
    this.asynchronous = true;
    return this;
  }

  isAsync(): boolean {
    return this.asynchronous;
  }

  add(name: string, params?: string[] | string | Statement[] | Statement): this {
    const st = new TsChainableCallStatement(name);
    forceArray(params).forEach(p => st.addParam(p instanceof Statement ? p : new Statement(p)));

    this.addStatement(st);
    return this;
  }

  render(): string {
    const rendering = super.render();
    return `${this.asynchronous ? 'await' : ''} ${rendering};`;
  }
}
