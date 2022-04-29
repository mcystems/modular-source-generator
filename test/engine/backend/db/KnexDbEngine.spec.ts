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
        import CreateTableBuilder from 'Knex.CreateTableBuilder';
        
        export async function up(knex: Knex): Promise<void> { 
            knex.schema.createTable("y", (t: CreateTableBuilder) => {
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
});