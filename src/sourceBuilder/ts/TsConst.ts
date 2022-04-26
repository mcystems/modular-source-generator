import {Statement} from "../generic/Statement";
import {Visibility} from "../generic/Visibility";

export class TsConst extends Statement {

  constructor(readonly name: string, readonly type: string | undefined, readonly value: string,
              visibility: Visibility) {
    super(`${visibility === Visibility.PUBLIC ? 'export' : ''} const ${name}${type ? `: ${type}` : ''} = ${value};`);
  }
}