import {MultiStatement} from "./MultiStatement";
import {Statement} from "./Statement";
import {EmptyStatement} from "./EmptyStatement";
import {CallStatement} from "sourceBuilder/generic/CallStatement";

export enum BlockType {
  IF = 'if', ELSEIF = 'else if', ELSE = 'else', DO = 'do', WHILE = 'while', FOR = 'for', TRY = 'try', CATCH = 'catch', FINALLY = 'finally', SWITCH = 'switch',
  RETURN = 'return', CASE = 'case', DEFAULT = 'default'
}

export class BlockStatement extends MultiStatement {

  private prefix: Statement = new EmptyStatement();
  private suffix: Statement = new EmptyStatement();
  private dontRenderEmpty: boolean = false;
  private blockStart: string = '{';
  private blockEnd: string = '}';

  constructor(id?: string) {
    super(undefined, id);
  }

  setPrefix(st: Statement): this {
    this.prefix = st;
    return this;
  }

  setSuffix(st: Statement): this {
    this.suffix = st;
    return this;
  }

  setDontRenderEmpty(): this {
    this.dontRenderEmpty = true;
    return this;
  }

  setNoBlockMark(): this {
    this.blockStart = '';
    this.blockEnd = '';
    return this;
  }

  static create(blockType: BlockType, param?: Statement, id?: string): BlockStatement {
    const st = new BlockStatement(id);
    const blockTypeSt = new Statement(blockType + ' ');
    switch (blockType) {
      case BlockType.IF:
      case BlockType.ELSEIF:
      case BlockType.WHILE:
      case BlockType.FOR:
      case BlockType.CATCH:
      case BlockType.SWITCH:
        if (!param) {
          throw new Error(`block type must have non empty param statement`);
        }
        st.setPrefix(new CallStatement(blockType, '').addParam(param));
        break;
      case BlockType.CASE:
        if (!param) {
          throw new Error(`block type must have non empty param statement`);
        }
        st.setPrefix(new MultiStatement().addStatement(blockTypeSt).addStatement(param).addStatement(new Statement(':')));
        break;
      case BlockType.TRY:
      case BlockType.ELSE:
      case BlockType.FINALLY:
      case BlockType.RETURN:
        if (param) {
          throw new Error(`block type must NOT have param statement`);
        }
        st.setPrefix(blockTypeSt);
        break;
      case BlockType.DEFAULT:
        if (param) {
          throw new Error(`block type must NOT have param statement`);
        }
        st.setPrefix(new MultiStatement().addStatement(blockTypeSt).addStatement(new Statement(":")));
        break;
      case BlockType.DO:
        if (!param) {
          throw new Error(`block type must have non empty param statement`);
        }
        st.setPrefix(blockTypeSt).setSuffix(new CallStatement(blockType, '').addParam(param))
    }
    return st;
  }

  render(): string {
    if (this.dontRenderEmpty && !this.getStatementsCount()) {
      return '';
    }
    return `${this.prefix.render()} ${this.blockStart} ${super.render()} ${this.blockEnd} ${this.suffix.render()}`;
  }
}