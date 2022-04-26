import {MultiStatement} from "../generic/MultiStatement";
import {Statement} from "../generic/Statement";
import {Visibility} from "../generic/Visibility";

export enum CreateType {
  CONSTANT = 'const', LET = 'let', NONE = ''
}

export class TsAssignmentStatement extends MultiStatement {

  private readonly identifier: Statement;
  private objId: string;
  private visibility: Visibility = Visibility.PRIVATE;

  constructor(identifier: string | Statement, readonly createType: CreateType, readonly type?: string,  id?: string) {
    super('', id);
    if (typeof identifier === "string") {
      this.identifier = new Statement(identifier);
    } else {
      this.identifier = identifier;
    }
  }

  setObjectId(objId: string): this {
    this.objId = objId;
    return this;
  }

  setExport(): this {
    this.visibility = Visibility.PUBLIC;
    return this;
  }

  private renderObjId(): string {
    if(!this.objId) {
      return '';
    }
    if (this.objId.match(/^['"`].*['"`]$/)) {
      return `[${this.objId}]`;
    }
    return `.${this.objId}`;
  }

  render(): string {
    const typeStr = this.type ? `:${this.type}` : '';
    const exprt = this.visibility === Visibility.PUBLIC ? 'export ': '';
    return `${exprt}${this.createType} ${this.identifier.render()}${this.renderObjId()}${typeStr}=${super.render()}`;
  }
}
