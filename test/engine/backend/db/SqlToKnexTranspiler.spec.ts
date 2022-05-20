import {SqlToKnexViewBuilderTranspiler} from "../../../../src/engine/backend/db/knex/SqlToKnexViewBuilderTranspiler";
import chai, {expect} from "chai";
import {CompileError} from "../../../../src/CompileError";

describe("sql to knex transpiler tests", () => {
  chai.config.truncateThreshold = 0;
  const sqlPos = {column: 0, pos: 0, line: 0};

  it("1", () => {
    const sql = new SqlToKnexViewBuilderTranspiler(sqlPos);
    const func = sql.transpileSql(`select * from a as b where a=1 and (b=2 or c=2)`);
    console.log(func.render());
  });
  it("complex select", () => {
    const sql = new SqlToKnexViewBuilderTranspiler(sqlPos);
    const func = sql.transpileSql(`select a1 as b2, (select id from axxx where id = 1) as c1 from a as b where a=1 and (b=2 or c=2)`);
    console.log(func.render());
  });
});

// 0626500159
