import {BlockStatement} from "./BlockStatement";
import {Statement} from "./Statement";

export class CaseStatement extends BlockStatement {

  constructor(private readonly param: string, id?: string) {
    super(id);
    this.setPrefix(new Statement(`case ${this.param}:`))
  }
}