import {CharacterPosition} from "xml2ts/dist/xmlTsNode";
import {KnexDbEngine} from "../../../../src/engine/backend/db/knex/KnexDbEngine";
import {DataType} from "../../../../src/model/data/Data";
import {FieldDataType} from "../../../../src/model/data/FieldDataType";
import {GeneratorContext} from "../../../../src/generator/GeneratorContext";
import {expectTsCodeEq} from "../../../tsCode/tsCodeComparator";
import {expect} from "chai";
import {SourceType} from "../../../../src/generator/SourceType";
import {Parser} from "node-sql-parser";
import Knex from "knex";

const pos: CharacterPosition = {
  pos: 0,
  line: 0,
  column: 0
}

describe(`knexDbEngine tests`, () => {
  it(`1`, () => {
    const e = KnexDbEngine.getInstance();
    e.handleEvent({
      name: 'y',
      domain: 'x',
      type: DataType.TABLE,
      pos: pos,
      code: [],
      indexes: [],
      noRoles: false,
      fields: [{
        domain: 'x',
        name: 'y',
        fieldName: 'z',
        pos: pos,
        dataType: FieldDataType.PRIMARY_KEY
      }, {
        domain: 'x',
        name: 'y',
        fieldName: 'uuid',
        pos: pos,
        required: true,
        unique: true,
        dataType: FieldDataType.UUID_PRIMARY_KEY
      }, {
        domain: 'x',
        name: 'y',
        fieldName: 'bool',
        pos: pos,
        dataType: FieldDataType.BOOLEAN
      }, {
        domain: 'x',
        name: 'y',
        fieldName: 'blahblah',
        pos: pos,
        dataType: FieldDataType.STRING
      }, {
        domain: 'x',
        name: 'y',
        fieldName: 'longBlah',
        pos: pos,
        dataType: FieldDataType.LONG_STRING
      }]
    });
    expect(GeneratorContext.getInstance().getSources()).to.exist;
    expect(GeneratorContext.getInstance().getSources().length).eq(2);
    const src = GeneratorContext.getInstance().getSources()[0];

    expectTsCodeEq("export interface YDto { z?: number; uuid: string; bool?: boolean; blahblah?: string; longBlah?: string;}", src.render());
    expect(src.name).eq("YDao");
    expect(src.location).eq("x");
    expect(src.type).eq(SourceType.BACKEND);

    const migrationFile = GeneratorContext.getInstance().getSources()[1];
    expectTsCodeEq(`
        import {Knex} from 'knex';
                
        export async function up(knex: Knex): Promise<void> { 
            knex.schema.createTable("y", (t: Knex.CreateTableBuilder) => {
                t.bigIncrements("z").primary().unique();
                t.uuid("uuid").primary().unique().notNullable();
                t.boolean("bool");
                t.string("blahblah");
                t.text("longBlah");
            });
        }    
        export async function down(knex: Knex): Promise<void> { 
            await knex.schema.dropTable("y");
        } 
    `, migrationFile.render());
    expect(migrationFile.location).eq("migration");
    expect(migrationFile.type).eq(SourceType.BACKEND);


  });
  it('nodesqlParser', () => {
    const sql = `
        select inv.name                                                          as inventory_name,
               art.number                                                        as article_number,
               art.name                                                          as article_name,
               art.size                                                          as article_size,
               s.amount                                                          as amount,
               u.name                                                            as unit_name,
               (select id from abc.xsd group by x)                               as xsdId,
               (select sum(amount) from abc.abc2 group by days having days > 10) as sumAboveTenDaysAmount,
               AVG(u.name)                                                       as avgUnitName,
               CASE
                   WHEN Quantity > 30 THEN "The quantity is greater than 30"
                   WHEN Quantity = 30 THEN "The quantity is 30"
                   ELSE "The quantity is under 30"
                   END                                                           as quantityText
        from (select name, number, a, b, c, d
              from inventory.storage s
                       join inventory.inventory inv
                            on s.inventory = inv.id
                       join inventory.article art on s.article = art.id
                       join inventory.articleUnit au on art.id = au.article
                       join inventory.unit u on au.unit = u.id)
        where s.id in (select max(s.id)
                       from inventory.article a
                                left join inventory.storage s on a.id = s.article
                                join inventory.inventory i on s.inventory = i.id
                       group by a.id
                              , i.id)
        union all
        select inv.name   as inventory_name,
               art.number as article_number,
               art.name   as article_name,
               art.size   as article_size,
               s.amount   as amount,
               u.name     as unit_name,
               null       as xsdId,
               0          as sumAboveTenDaysAmount,
               0          as avgUnitName
        from inventory.storage s
                 join inventory.inventory inv
                      on s.inventory = inv.id
                 join inventory.article art on s.article = art.id
                 join inventory.articleUnit au on art.id = au.article
                 join inventory.unit u on au.unit = u.id
        where s.id = 999999
        union
        select *
        from a;
    `;


  });

  it("complex where statement", () => {
    const sql = `select "id",
                        (select * from "ccc") as "x"
                 from (select *from "xa") as "xa1",
                      l2
                 where "age" > (select count(*) from "b")
                   and "x" = '2'
                   and ("a" in (2, 3, 3, 4, 6) or "b" = 2)`;
    const parser = new Parser();
    const ast = parser.astify(sql);
    const astList = Array.isArray(ast) ? ast : [ast];

    console.log(JSON.stringify(astList, null, 2));
  });
});


describe("knex select statement builder tests", () => {
  const knex = Knex({
    client: 'sqlite3',
    connection: {
      filename: ":memory:"
    }
  });
  it("1", () => {
    // @ts-ignore
    console.log(knex.from([t=>t.from("xa"), "xb"], {only: true}).where("a.x", "=", 1).toSQL());


  });// jul 13 szerda 9:30 1239 orbanhegyi dulo 29
});
