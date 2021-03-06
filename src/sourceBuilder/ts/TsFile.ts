import {SourceFile} from "../../generator/SourceFile";
import {Imports} from "../generic/Imports";
import {MultiStatement} from "../generic/MultiStatement";
import {SourceType} from "../../generator/SourceType";
import {Statement} from "../generic/Statement";


export class TsFile implements SourceFile {
  private readonly imports: Imports = new Imports();
  private readonly statements: MultiStatement = new MultiStatement();

  constructor(readonly name: string, readonly type: SourceType, readonly location: string) {
  }

  addImport(name: string, from: string): this {
    this.imports.add(name, from);
    return this
  }

  addStatement(st: Statement): this {
    this.statements.addStatement(st);
    return this;
  }

  mergeImports(other: Imports): this {
    this.imports.merge(other);
    return this;
  }

  getImports(): Imports {
    return this.imports;
  }

  render(): string {
    return `${this.imports.getImportStatements()}\n${this.statements.render()}`;
  }

  getStatements(): MultiStatement {
    return this.statements;
  }
}