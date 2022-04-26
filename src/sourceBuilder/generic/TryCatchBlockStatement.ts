import {MultiStatement} from "./MultiStatement";
import {Statement} from "./Statement";
import {BlockStatement, BlockType} from "./BlockStatement";

export class TryCatchBlockStatement extends Statement {

  private tryBlock = BlockStatement.create(BlockType.TRY);
  private catchBlock = BlockStatement.create(BlockType.CATCH, new Statement("error"));

  constructor(id?: string) {
    super(undefined,id);
  }

  getTryBlock(): MultiStatement {
    return this.tryBlock;
  }

  getCatchBlock(): MultiStatement {
    return this.catchBlock;
  }

  render(): string {
    return `${this.tryBlock.render()}${this.catchBlock.render()}`;
  }
}