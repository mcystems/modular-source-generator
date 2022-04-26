import {Statement} from "./Statement";

export class MultiStatement extends Statement {

  private statements: Statement[] = [];
  protected joinString: string = '\n';

  constructor(st?: string, id?: string) {
    super(st, id);
  }

  getStatementsCount(): number {
    return this.statements.length;
  }

  render(): string {
    return this.statements.join(this.joinString);
  }

  addStatement(st: Statement): this {
    this.statements.push(st);
    return this;
  }

  replaceStatement(id: string, newStatement: Statement, copyTreeUnderReplacement: boolean = false): boolean {
    if (id === newStatement.getId()) {
      throw new Error(`can not replace itself`);
    }

    for (let i = 0; i < this.statements.length; i++) {
      if (this.statements[i].getId() === id) {
        if (copyTreeUnderReplacement && this.statements[i] instanceof MultiStatement) {
          if (!(newStatement instanceof MultiStatement)) {
            throw new Error(`copyTreeUnderReplacement only works with MultiStatement`);
          }
          const old = (<MultiStatement><unknown>this.statements[i]).statements;
          this.statements[i] = newStatement;
          old.forEach(st => newStatement.addStatement(st));
        } else {
          this.statements[i] = newStatement;
        }
        return true;
      } else if (this.statements[i] instanceof MultiStatement && (<MultiStatement><unknown>this.statements[i]).replaceStatement(id, newStatement)) {
        return true;
      }
    }
    return false;
  }

  clearStatements(): this {
    this.statements.forEach(s => s.unregister());
    this.statements = [];
    return this;
  }

  * iterator() {
    for (let st of this.statements) {
      yield st;
    }
  }
}