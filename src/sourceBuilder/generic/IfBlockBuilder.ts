import {Statement} from "./Statement";
import {MultiStatement} from "./MultiStatement";
import {BlockStatement, BlockType} from "./BlockStatement";

export class IfBlockBuilder {

  private counter: number = 0;
  private conditions: MultiStatement = new MultiStatement();

  constructor() {
  }

  condition(param?: Statement): BlockStatement {
    const block: BlockStatement = !this.counter ? BlockStatement.create(BlockType.IF, param) : BlockStatement.create(BlockType.ELSEIF, param);
    this.conditions.addStatement(block);
    ++this.counter;
    return block;
  }

  any(): BlockStatement {
    const block = BlockStatement.create(BlockType.ELSE);
    this.conditions.addStatement(block);
    return block;
  }

  build(): MultiStatement {
    return this.conditions;
  }
}