import {FieldDataType} from "../../model/data/FieldDataType";
import {TsDataType} from "./TsDataType";


export function fieldDataToTypescriptType(fieldDataType: FieldDataType): TsDataType {
  switch (fieldDataType) {
    case FieldDataType.BOOLEAN:
      return TsDataType.BOOLEAN;
    case FieldDataType.PASSWORD:
    case FieldDataType.DATA:
    case FieldDataType.STRING:
    case FieldDataType.EMAIL:
    case FieldDataType.LONG_STRING:
    case FieldDataType.ENUMERATION:
    case FieldDataType.UUID_PRIMARY_KEY:
      return TsDataType.STRING;
    case FieldDataType.DATE:
    case FieldDataType.DATETIME:
      return TsDataType.DATE;
    case FieldDataType.PRIMARY_KEY:
    case FieldDataType.CURRENCY:
    case FieldDataType.NUMBER:
    case FieldDataType.REFERENCE:
      return TsDataType.NUMBER;
    default:
      throw new Error(`unmapped type`);
  }
}