import {Visibility} from "../generic/Visibility";
import {Statement} from "../generic/Statement";

export class TsMember extends Statement {
  protected name: string;
  protected visibility: Visibility;
  protected abstract: boolean;
  protected readonly params: string[] = [];
  protected returnType: string;
  protected constant: boolean;
  protected static: boolean;
  protected definition: string;

  constructor() {
    super('');
  }

  setName(n: string): this {
    this.name = n;
    return this;
  }

  setVisibility(v: Visibility): this {
    this.visibility = v;
    return this;
  }

  setAbstract(a: boolean): this {
    this.abstract = a;
    return this;
  }

  addParam(param: string): this {
    this.params.push(param);
    return this;
  }

  setReturnType(r: string): this {
    this.returnType = r;
    return this;
  }

  setConstant(v: boolean): this {
    this.constant = v;
    return this;
  };

  setStatic(v: boolean): this {
    this.static = v;
    return this;
  };

  setDefinition(v: string): this {
    this.definition = v;
    return this;
  }

  private renderVisibility(): string {
    if (!this.visibility) {
      return '';
    }
    switch (this.visibility) {
      case Visibility.PUBLIC:
        return '';
      case Visibility.PRIVATE:
        return 'private';
      case Visibility.PROTECTED:
        return 'protected';
      default:
        throw new Error(`invalid visibility: ${this.visibility}`);
    }
  }

  render(): string {
    const staticKeyword = this.static ? 'static' : '';
    const constant = this.constant ? 'const' : '';
    const returnType = this.returnType ? `: ${this.returnType}` : '';
    const definition = this.definition ? `= ${this.definition}` : '';
    this.setStatement(
      `${this.renderVisibility()} ${staticKeyword} ${constant} ${this.name} ${returnType} ${definition};`);
    return super.render();
  }

}