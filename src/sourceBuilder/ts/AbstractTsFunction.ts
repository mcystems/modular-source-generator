import {TsJsonParam} from "./TsJsonParam";
import {MultiStatement} from "../generic/MultiStatement";

export abstract class AbstractTsFunction extends MultiStatement {
  protected readonly params: { name: string, type: string }[] = [];
  protected jsonParams = new TsJsonParam();
  protected asynchronous: boolean;

  protected constructor(st?: string, id?: string) {
    super(st, id);
  }

  addParam(name: string, type: string): this {
    this.params.push({name, type});
    return this;
  }

  addJsonParam(key: string, value: string): this {
    this.jsonParams.addParts(key, value);
    return this;
  }

  addJsonParamObj(param: TsJsonParam): this {
    this.jsonParams = param;
    return this;
  }

  setAsynchronous(a: boolean = true): this {
    this.asynchronous = a;
    return this;
  }

  setStatement(statement: string) {
    throw new Error(`do not use this function`);
  }

  getParams(): { name: string, type: string }[] {
    return this.params;
  }

  getJsonParams(): TsJsonParam {
    return this.jsonParams;
  }

  isAsync(): boolean {
    return this.asynchronous;
  }
}