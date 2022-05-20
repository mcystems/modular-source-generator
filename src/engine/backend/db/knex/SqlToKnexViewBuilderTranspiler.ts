import {AST, Parser} from "node-sql-parser";
import {forceArray} from "../../../../utilities";
import {CharacterPosition} from "xml2ts/dist/xmlTsNode"
import {TsFunction} from "../../../../sourceBuilder/ts/TsFunction";
import {Statement} from "../../../../sourceBuilder/generic/Statement";
import {TsChainCallStatement} from "../../../../sourceBuilder/ts/TsChainCallStatement";
import {CompileError} from "../../../../CompileError";
import {TsArrowFunction} from "../../../../sourceBuilder/ts/TsArrowFunction";
import {MultiStatement} from "../../../../sourceBuilder/generic/MultiStatement";

export class SqlToKnexViewBuilderTranspiler {
  private usedColumns: string[] = [];
  private usedTables: string[] = [];

  constructor(readonly sqlPos: CharacterPosition) {
  }

  transpileSql(sql: string): TsFunction {
    const parser = new Parser();
    const astList = forceArray(parser.astify(sql));
    const tsFunc = new TsFunction().addParam('view', 'Knex.ViewBuilder');

    for (let ast of astList) {
      tsFunc.addStatement(this.transpileAst("view", ast));
    }
    return tsFunc;
  }

  private transpileAst(instanceName: string, ast: AST): Statement {
    let st = new TsChainCallStatement();
    if (ast.type === "select") {
      if (ast.columns) {
        this.transpileSelect(ast.columns, instanceName, st);
      }
      if (ast.from) {
        this.transpileFrom(ast.from, st);
      }
      if(ast.where) {
        st.add(`${instanceName}.where`, this.expression(ast.where));
      }
    }
    return st;
  }

  private transpileSelect(columns: any, instanceName: string, chainCallStatement: TsChainCallStatement): void {
    const cols = forceArray(columns);
    const st = cols.length>1
    for (let col of cols) {
      if (col === '*') {
        st.add(`${instanceName}.select`, `"*"`);
      } else if (col.expr?.ast) {
        st.addStatement(new TsArrowFunction().addParam("t", "any").addStatement(new Statement(`${this.transpileAst('t', col.expr.ast)}`)));
      } else {
        st.add(`${instanceName}.select`, this.expression(col.expr));
      }
      if (col.as) {
        st.add("as", `"${col.as}"`);
      }
    }
  }

  private expression(expr: any): Statement {
    switch (expr.type) {
      case "binary_expr":
        return this.binaryExpression(expr);
      case "column_ref":
        if (expr.table) {
          this.usedColumns.push(`${expr.table}.${expr.column}`);
          return new Statement(`"${expr.table}.${expr.column}"`);
        } else {
          this.usedColumns.push(expr.column);
          return new Statement(`"${expr.column}"`);
        }
      case "number":
        return new Statement(expr.value);
      case "string":
        return new Statement(`"${expr.value}"`);
      case "single_quote_string":
        return new Statement(`'${expr.value}'`);
      case "backticks_quote_string":
        return new Statement(`\`${expr.value}\``);
      case "expr_list":
        return this.expressionList(expr.value);
      default:
        throw new Error(`unhandled expr: ${expr.type}`);
    }
  }

  private expressionList(exprList: any[]): Statement {
    return new Statement(`[${exprList.map(e => this.expression(e)).join()}]`);
  }

  private binaryExpression(expr: any): Statement {
    switch (expr.operator) {
      case "AND":
        return new TsArrowFunction()
          .addParam("t", "any")
          .addStatement(new TsChainCallStatement()
            .add("t.andWhere", this.expression(expr.left))
            .add("andWhere", this.expression(expr.right))
          );
      case "OR":
        return new TsArrowFunction()
          .addParam("t", "any")
          .addStatement(new TsChainCallStatement()
            .add("t.orWhere", this.expression(expr.left))
            .add("orWhere", this.expression(expr.right))
          );
      case "BETWEEN":
        return new TsArrowFunction()
          .addParam("t", "any")
          .addStatement(new TsChainCallStatement()
            .add("t.whereBetween", [this.expression(expr.left), this.expression(expr.right)])
          );
      case "NOT BETWEEN":
        return new TsArrowFunction()
          .addParam("t", "any")
          .addStatement(new TsChainCallStatement()
            .add("t.whereNotBetween", [this.expression(expr.left), this.expression(expr.right)])
          );
      case "IN":
        return new TsArrowFunction()
          .addParam("t", "any")
          .addStatement(new TsChainCallStatement()
            .add("t.whereIn", [this.expression(expr.left), this.expression(expr.right)])
          );
      case "NOT IN":
        return new TsArrowFunction()
          .addParam("t", "any")
          .addStatement(new TsChainCallStatement()
            .add("t.whereNotIn", [this.expression(expr.left), this.expression(expr.right)])
          );
      case ">=":
      case ">":
      case  "<=":
      case  "<>":
      case  "<":
      case  "=":
      case  "!=":
        return new MultiStatement().setJoinString(",")
          .addStatement(this.expression(expr.left))
          .addStatement(new Statement(`"${expr.operator}"`))
          .addStatement(this.expression(expr.right));
      default:
        throw new Error(`unknown operator: ${expr.operator}`);
    }
  }

  private transpileFrom(from: any[], st: TsChainCallStatement): void {
    if (from.length > 1) {
      throw new CompileError(`knex does not fully support selecting from multiple table use join instead`, this.sqlPos);
    }
    let fr = from[0];
    if (fr.expr) {
      st.add("from", [this.transpileAst('t', fr.expr.ast)]);
    } else if (Object.keys(fr).some(k => ['db', 'table', 'any'].indexOf(k) >= 0)) {
      const parts: string[] = [];
      if (fr.db) {
        parts.push(fr.db);
      }
      parts.push(fr.table);
      st.add("from", [`"${parts.join(".")}"`]);
      if (fr.as) {
        parts.push(fr.as);
        st.add("as", [`"${fr.as}"`]);
      }
      this.usedTables.push(parts.join("."));
    } else {
      throw new CompileError(`unexpected from case`, this.sqlPos);
    }
  }
}
