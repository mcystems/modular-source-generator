import {MultiStatement} from "../generic/MultiStatement";

export class TsArrayStatement extends MultiStatement {

  constructor(st?: string, id?: string) {
    super(st, id);
    this.joinString = ',';
  }

  render(): string {
    return `[${super.render()}]`
  }
}