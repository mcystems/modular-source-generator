import { MultiStatement } from "../generic/MultiStatement";
import { Statement } from "../generic/Statement";
import {Visibility} from "../generic/Visibility";

export class ClassLike<EXTEND_TYPE extends Array<string> | string> extends Statement {
  protected readonly members = new MultiStatement();
  protected name: string;
  protected visibility: Visibility;

  protected extends: EXTEND_TYPE;

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

  setExtends(e: EXTEND_TYPE) {
    if (Array.isArray(this.extends)) {
      if (typeof e === 'string') {
        this.extends.push(e);
      } else {
        throw new Error(`parameter must be a string`);
      }
    } else {
      this.extends = e;
    }
  }

  getExtends() {
    return this.extends;
  }

  setMember(member: Statement): this {
    this.members.addStatement(member);
    return this;
  }

  getMembers(): MultiStatement {
    return this.members;
  }
}