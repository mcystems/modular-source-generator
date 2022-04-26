import {Statement} from "sourceBuilder/generic/Statement";
import {MultiStatement} from "sourceBuilder/generic/MultiStatement";
import {Visibility} from "sourceBuilder/generic/Visibility";

export class ClassLike<EXTEND_TYPE extends Array<string> | string> extends Statement {
  protected readonly members = new MultiStatement();
  protected name: string;
  protected visibility: Visibility;

  protected _extends: EXTEND_TYPE;

  setName(v: string): this {
    this.name = v;
    return this;
  }

  getName(): string {
    return this.name;
  }

  setVisibility(v: Visibility): this {
    this.visibility = v;
    return this;
  }

  set extends(e: EXTEND_TYPE) {
    if (Array.isArray(this._extends)) {
      if (typeof e === 'string') {
        this._extends.push(e);
      } else {
        throw new Error(`parameter must be a string`);
      }
    } else {
      this._extends = e;
    }
  }

  get extends() {
    return this._extends;
  }

  setMember(member: Statement): this {
    this.members.addStatement(member);
    return this;
  }

  getMembers(): MultiStatement {
    return this.members;
  }
}