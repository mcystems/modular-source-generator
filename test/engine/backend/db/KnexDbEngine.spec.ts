import {CharacterPosition} from "xml2ts/dist/xmlTsNode";
import {KnexDbEngine} from "../../../../src/engine/backend/db/KnexDbEngine";
import {DataType} from "../../../../src/model/data/Data";
import {FieldDataType} from "../../../../src/model/data/FieldDataType";
import {GeneratorContext} from "../../../../src/generator/GeneratorContext";
import {expectTsCodeEq} from "../../../tsCode/tsCodeComparator";
import {expect} from "chai";
import {SourceType} from "../../../../src/generator/SourceType";

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
      }]
    });
    expect(GeneratorContext.getInstance().getSources()).to.exist;
    expect(GeneratorContext.getInstance().getSources().length).eq(2);
    const src = GeneratorContext.getInstance().getSources()[0];

    expectTsCodeEq("export interface YDto { y?: number; }", src.render());
    expect(src.name).eq("YDao");
    expect(src.location).eq("x");
    expect(src.type).eq(SourceType.BACKEND);

    const migrationFile = GeneratorContext.getInstance().getSources()[1];
    expectTsCodeEq(`
        import {Knex} from 'knex';
        import CreateTableBuilder from 'Knex.CreateTableBuilder';
        
        export async function up(knex: Knex): Promise<void> { 
            knex.schema.createTable("y", (t: CreateTableBuilder) => {
                t.bigIncrements("z").primary().unique();
            });
        }    
        export async function down(knex: Knex): Promise<void> { 
            await knex.schema.dropTable("y");
        } 
    `, migrationFile.render());
  })
});