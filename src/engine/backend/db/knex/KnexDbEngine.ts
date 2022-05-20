import {Engine} from "../../../Engine";
import {Data, DataType} from "../../../../model/data/Data";
import {GeneratorContext} from "../../../../generator/GeneratorContext";
import {SourceType} from "../../../../generator/SourceType";
import {TsFile} from "../../../../sourceBuilder/ts/TsFile";
import {domainNameFieldOf, domainNameOf} from "../../../../model/DomainNameElement";
import {TsInterface} from "../../../../sourceBuilder/ts/TsInterface";
import {TsMember} from "../../../../sourceBuilder/ts/TsMember";
import {fieldDataToTypescriptType} from "../../../../sourceBuilder/ts/FieldDataToTypescriptType";
import {Field} from "../../../../model/data/Field";
import {Statement} from "../../../../sourceBuilder/generic/Statement";
import {TsCallStatement} from "../../../../sourceBuilder/ts/TsCallStatement";
import {TsArrowFunction} from "../../../../sourceBuilder/ts/TsArrowFunction";
import {MultiStatement} from "../../../../sourceBuilder/generic/MultiStatement";
import {TsFunction} from "../../../../sourceBuilder/ts/TsFunction";
import {TsChainCallStatement} from "../../../../sourceBuilder/ts/TsChainCallStatement";
import {FieldDataType} from "../../../../model/data/FieldDataType";
import _ from "lodash";
import {CompileError} from "../../../../CompileError";
import {ModelCache} from "../../../../model/ModelCache";

let instance: KnexDbEngine | undefined;

export class KnexDbEngine implements Engine<Data> {

  static migrationFuncId = `migration.up`;

  private constructor() {
    GeneratorContext.getInstance().setProjectDependencies(SourceType.BACKEND, [{
      name: 'knex',
      version: '2.0.0',
      development: false
    }]).addMessagesToUser(`install and save one of the following driver pg, pg-native, sqlite3, better-sqlite3, mysql, mysql2, oracledb, tedious`);
  }

  static getInstance(): KnexDbEngine {
    if (!instance) {
      instance = new KnexDbEngine();
    }
    return instance;
  }

  handleEvent(data: Data) {
    this.setupModelFile(data);
    this.setupMigration(data);
  }

  private setupModelFile(data: Data) {
    const modelFile = new TsFile(`${_.upperFirst(data.name)}Dao`, SourceType.BACKEND, _.lowerFirst(data.domain));
    modelFile.addStatement(this.getModelClass(data));
    GeneratorContext.getInstance().setSource(`${domainNameOf(data)}.model`, modelFile);
  }

  private getModelClass(data: Data): TsInterface {
    const dtoInterface = new TsInterface()
      .setName(`${_.upperFirst(data.name)}Dto`)
      .setExport();
    data.fields.forEach(f => {
      dtoInterface.setMember(new TsMember()
        .setName(_.lowerFirst(f.fieldName))
        .setReturnType(fieldDataToTypescriptType(f.dataType))
        .setOptional(!f.required)
      )
    });
    return dtoInterface;
  }

  private mapFieldTypeToFieldCreateStatement(field: Field, builderName: string): Statement {
    const st = this.getStatementByFieldDataType(field);
    st.prependStatement(new Statement(builderName));
    if (field.required) {
      st.add('notNullable', []);
    }
    if (field.unique && field.dataType !== FieldDataType.UUID_PRIMARY_KEY && field.dataType !== FieldDataType.PRIMARY_KEY) {
      st.add('unique');
    }
    return st;
  }

  private createView(upFunc: TsFunction, data: Data): void {

    const idField = data.fields.find(f => f.dataType === FieldDataType.PRIMARY_KEY || f.dataType === FieldDataType.UUID_PRIMARY_KEY);
    if (!idField) {
      throw new CompileError('no id field for view', data.pos);
    }
    if (idField.dataType === FieldDataType.UUID_PRIMARY_KEY) {
      throw new CompileError(`uuid primary key is not available for views with knex ab engine`, idField.pos);
    }
    if(!idField.references) {
      throw new CompileError(`view id field must referencing to something`, idField.pos);
    }
    const refField = ModelCache.getInstance().getFieldByDomainDataFieldName(domainNameFieldOf(idField.references));
    if(!refField) {
      throw new CompileError(`referenced field is not defined or not yet parsed`, idField.pos);
    }



  }

  private setupMigration(data: Data): void {
    const upFunc = this.getDDLUpFunctionAndSetDDLFileWhenNeeded(data);

    switch (data.type) {
      case DataType.TABLE: {
        const st: Statement[] = data.fields.map(f => this.mapFieldTypeToFieldCreateStatement(f, 't'));
        upFunc.addStatement(
          new TsCallStatement(`knex.schema.createTable`)
            .addParam(new Statement(`"${data.name}"`))
            .addParam(new TsArrowFunction()
              .addParam('t', 'Knex.CreateTableBuilder')
              .addStatement(new MultiStatement().addStatements(st))
            )
        );
        break;
      }
      case DataType.VIEW: {
        this.createView(upFunc, data);
        break;
      }
      default:
        throw new CompileError(`invalid data type`, data.pos);
    }
    const downFunc = this.getDDLDownFunctionAndSetDDLFileWhenNeeded(data);
    downFunc.addStatement(new TsCallStatement(`knex.schema.dropTable`).addParam(new Statement(`"${data.name}"`)).setAsync());
  }

  private getFunctionWithCreateSrc(funcName: string, data: Data): TsFunction {
    const funcId = `${domainNameOf(data)}.migration.${funcName}`;
    const fileId = `${domainNameOf(data)}.migration`;

    let src: TsFunction | undefined = <TsFunction>Statement.findById(funcId);

    if (!src) {
      const dStr = new Date().toISOString().replace(/[-T:]/g, '').replace(/\..+/, '');
      let srcFile: TsFile | undefined = <TsFile>GeneratorContext.getInstance().getSource(fileId);
      if (!srcFile) {
        srcFile = new TsFile(`${dStr}.ts`, SourceType.BACKEND, "migration");
      }
      srcFile.addImport(`{Knex}`, 'knex');
      src = new TsFunction(funcName, `Promise<void>`, funcId)
        .addParam("knex", "Knex")
        .setAsynchronous().setExport()
      srcFile.addStatement(src);
      GeneratorContext.getInstance().setSource(fileId, srcFile);
    }
    return src;
  }

  private getDDLDownFunctionAndSetDDLFileWhenNeeded(data: Data): TsFunction {
    return this.getFunctionWithCreateSrc('down', data);
  }

  private getDDLUpFunctionAndSetDDLFileWhenNeeded(data: Data): TsFunction {
    return this.getFunctionWithCreateSrc('up', data);
  }

  private getStatementByFieldDataType(field: Field): TsChainCallStatement {
    const fieldName = `"${_.lowerFirst(field.fieldName)}"`;
    switch (field.dataType) {
      case FieldDataType.PRIMARY_KEY:
        return new TsChainCallStatement().add('bigIncrements', [fieldName]).add('primary').add('unique');
      case FieldDataType.UUID_PRIMARY_KEY:
        return new TsChainCallStatement().add(`uuid`, [fieldName]).add('primary').add('unique');
      case FieldDataType.BOOLEAN:
        return new TsChainCallStatement().add(`boolean`, [fieldName]);
      case FieldDataType.DATA:
      case FieldDataType.STRING:
      case FieldDataType.EMAIL:
      case FieldDataType.ENUMERATION:
      case FieldDataType.PASSWORD:
        return new TsChainCallStatement().add('string', [fieldName]);
      case FieldDataType.LONG_STRING:
        return new TsChainCallStatement().add('text', [fieldName]);
      case FieldDataType.DATE:
        return new TsChainCallStatement().add('date', [fieldName]);
      case FieldDataType.DATETIME:
        return new TsChainCallStatement().add('datetime', [fieldName]);
      case FieldDataType.CURRENCY:
        return new TsChainCallStatement().add('decimal', ["15", "2"]);
      case FieldDataType.NUMBER:
        return new TsChainCallStatement().add('double');
      case FieldDataType.REFERENCE: {
        if (!field.references) {
          throw new CompileError(`reference field type without reference`, field.pos);
        }
        return new TsChainCallStatement().add('references', [`${field.references.fieldName}`]).add('inTable', [field.references.name]);
      }
    }
  }
}