import {XmlTsNode} from "xml2ts/dist/xmlTsNode";
import {Data, DataType} from "model/data/Data";
import {XmlError} from "xmlInterpreter/XmlError";
import {Field} from "model/data/Field";
import {FieldDataType} from "model/data/FieldDataType";
import {checkAttr, checkAttrAndWhitespace, checkAttrAndWhitespaceBoolean, checkAttrNumeric} from "xmlInterpreter/Interpreter";
import {ModelCache} from "model/ModelCache";
import {EnumerationInterpreter} from "xmlInterpreter/EnumerationInterpreter";
import {DomainNameElement} from "model/DomainNameElement";
import {forceArray} from "utilities";
import _ from "lodash";
import {Code} from "model/Code";
import {Api} from "model/api/Api";
import {Method} from "model/api/Method";
import {MethodName} from "model/api/MethodName";
import {Index} from "model/data/Index";

const valueDataTypeMap: Map<string, DataType> = new Map(Object.entries(DataType).map(e => {
  return [e[1], DataType[e[0]]]
}));

const fieldDataTypeMap: Map<string, FieldDataType> = new Map(Object.entries(FieldDataType).map(e => {
  return [e[1], FieldDataType[e[0]]]
}));

const methodNameMap: Map<string, MethodName> = new Map(Object.entries(MethodName).map(e => {
  return [e[1], MethodName[e[0]]];
}))

export class DataInterpreter {

  static interpret(node: XmlTsNode): Data {
    const name = checkAttrAndWhitespace('name', node, false);
    const domain = checkAttrAndWhitespace('domain', node, false);
    const type = checkAttrAndWhitespace('type', node, false);
    const dataType = valueDataTypeMap.get(type);
    if (!dataType) {
      throw new XmlError(`type attribute value is not accepted`, node);
    }
    if (name.search(/^\d|\W+/g) === -1 || domain.search(/^\d|\W+/g) === -1) {
      throw new XmlError(`name and domain attribute must not start with number and can contain alphanumeric characters only`, node);
    }
    if (!node.fields) {
      throw new XmlError(`data must have fields defined`, node);
    }

    let fields: Field[];
    switch (dataType) {
      case DataType.TABLE:
        fields = DataInterpreter.interpretTableFields({domain, name}, node.fields);
        break;
      case DataType.VIEW:
        fields = DataInterpreter.interpretViewsFields({domain, name}, node.fields);
        break;
      default:
        throw new XmlError(`unhandled table type`, node);
    }

    return {
      domain,
      name,
      type: dataType,
      pos: node.pos,
      fields: fields,
      code: DataInterpreter.interpretCode(forceArray(node.code)),
      indexes: DataInterpreter.interpretIndexes(fields, node.indexes),
      noRoles: false,
      api: DataInterpreter.interpretApi(node.api)
    }
  }

  private static interpretTableFields(d: DomainNameElement, node: XmlTsNode): Field[] {
    const fields: Field[] = [];
    for (let field of node.$$ || []) {

      if (field.name !== 'field') {
        throw new XmlError(`only field node is accepted here`, field);
      }
      const fieldName = checkAttrAndWhitespace('name', field, false);
      const type = checkAttrAndWhitespace('type', field, false);
      const unique = checkAttrAndWhitespaceBoolean('unique', field, true);
      const required = checkAttrAndWhitespaceBoolean('required', field, true);

      if (field?.$?.references) {
        throw new XmlError(`table fields are not referencing to anything`, field);
      }
      const fieldDataType: FieldDataType | undefined = fieldDataTypeMap.get(type);
      if (!fieldDataType) {
        throw new XmlError(`field type is invalid or not declared`, field);
      }

      if (fieldDataType === FieldDataType.UUID_PRIMARY_KEY || fieldDataType === FieldDataType.PRIMARY_KEY) {
        ModelCache.getInstance().setIdFieldNameOfData(d, fieldName);
      }

      const populatedField: Field = {
        ...d,
        pos: field.pos,
        fieldName,
        dataType: fieldDataType,
        required,
        unique
      }

      if (field?.$?.references) {
        const data = ModelCache.getInstance().getDataByDomainName(field.$.references);
        if (!data) {
          throw new XmlError(`referenced table can not be found`, field);
        }
        const idFieldName = ModelCache.getInstance().getIdFieldNameOfData(data);
        if (!idFieldName) {
          throw new XmlError(`data does not have id field`, data);
        }
        populatedField.references = {...data, fieldName: idFieldName};
      }

      switch (fieldDataType) {
        case FieldDataType.NUMBER:
        case FieldDataType.CURRENCY:
          if (field?.$?.minLength || field?.$?.maxLength) {
            throw new XmlError(`numeric fields use minValue, maxValue attributes`, field);
          }
          populatedField.minValue = checkAttrNumeric('minValue', field, true);
          populatedField.maxValue = checkAttrNumeric('maxValue', field, true);
          break;
        case FieldDataType.STRING:
        case FieldDataType.LONG_STRING:
        case FieldDataType.EMAIL:
          if (field?.$?.minValue || field?.$?.maxValue) {
            throw new XmlError(`string fields use minLength, maxLength attributes`, field);
          }
          populatedField.minLength = checkAttrNumeric('minLength', field, true);
          populatedField.maxLength = checkAttrNumeric('maxLength', field, true);
          break;
        case FieldDataType.ENUMERATION: {
          if (field.value) {
            const values = EnumerationInterpreter.interpretValues(d, forceArray(field.value));
            populatedField.fixedValues = {...d, values};
          } else if (field?.$?.of) {
            const e = ModelCache.getInstance().getEnumerationByName(field.$.of);
            if (!e) {
              throw new XmlError(`enumeration can not be found`, field);
            }
            populatedField.fixedValues = e;
          } else {
            throw new XmlError(`'enumeration fields needs 'of' attribute or values'`, field);
          }
          break;
        }
      }
      fields.push(populatedField);
    }
    return fields;
  }

  private static interpretViewsFields(d: DomainNameElement, fields: XmlTsNode): Field[] {
    const populatedFields: Field[] = [];
    for (let field of fields.$$ || []) {
      if (field.name !== 'field') {
        throw new XmlError(`only field node is accepted here`, field);
      }
      const fieldName = checkAttrAndWhitespace('name', field, false);
      const references = checkAttrAndWhitespace('references', field, false);
      const f = ModelCache.getInstance().getFieldByDomainDataFieldName(references);
      if (!f) {
        throw new XmlError(`referenced field can not be found`, field);
      }
      populatedFields.push({
        ...d,
        pos: field.pos,
        fieldName,
        dataType: FieldDataType.REFERENCE,
        hint: field?.$?.hint,
        references: f
      });
    }
    return populatedFields;
  }

  private static interpretIndexes(fields: Field[], node: XmlTsNode | undefined): Index[] {
    const populatedIndexes: Index[] = [];
    const sortedFields = [...fields].sort((a, b) => a.fieldName.localeCompare(b.fieldName)).map(f => f.fieldName);
    for (let index of node?.index || []) {
      if (index.name !== 'index') {
        throw new XmlError(`only index node allowed here`, index);
      }
      const name = checkAttrAndWhitespace('name', index, false);
      const fieldsAttr = checkAttr('fields', index, false);
      const orders = checkAttr('orders', index, false);

      const invalidFields = fieldsAttr.split(',').filter(f => _.sortedIndexOf(sortedFields, f) < 0);
      if (invalidFields.length > 0) {
        throw new XmlError(`'fields' attribute referencing fields which are not in table`, index);
      }

      populatedIndexes.push({
        name,
        fields: fieldsAttr.split(','),
        orders: orders.split(',')
      });
    }
    return populatedIndexes;
  }

  private static interpretCode(codes: XmlTsNode[]): Code[] {
    return codes.map(node => {
      const event = checkAttrAndWhitespace('event', node, false);
      const transactional = checkAttrAndWhitespaceBoolean('transactional', node, true);
      const code = node._;
      if (!code) {
        throw new XmlError(`empty code cdata is not allowed`, node);
      }
      return {
        transactional,
        code,
        event,
        pos: node.pos
      }
    });
  }

  private static interpretApi(api: XmlTsNode | undefined): Api | undefined {
    if (!api) {
      return undefined;
    }
    const version = checkAttrNumeric('version', api, true);
    const role = checkAttrAndWhitespace('role', api, true);
    const apiName = checkAttrAndWhitespace('name', api, true);
    const apiDisabled = checkAttrAndWhitespaceBoolean('name', api, true);

    const methods: Method[] = forceArray(api?.method).map(m => {
      const name = checkAttrAndWhitespace('name', m, false);
      const methodDisabled = checkAttrAndWhitespaceBoolean('disabled', m, false);
      const role = checkAttr('role', m, true);
      const methodName: MethodName | undefined = methodNameMap.get(name);
      if (!methodName) {
        throw new XmlError(`method name is valid`, m);
      }
      return {
        name: methodName,
        disabled: methodDisabled,
        role
      }
    });
    return {
      pos: api.pos,
      methods,
      role,
      version,
      name: apiName,
      disabled: apiDisabled
    };
  }
}