import {Visibility} from "../generic/Visibility";
import {AbstractTsFunction} from "./AbstractTsFunction";

export class TsMemberFunction extends AbstractTsFunction {
  protected name: string;
  protected visibility: Visibility;
  protected abstract: boolean;
  protected returnType: string;
  protected constant: boolean;
  protected static: boolean;

  constructor(id?: string) {
    super('', id);
  }

  setName(n: string): this {
    this.name = n;
    return this;
  }

  getName(): string {
    return this.name;
  }

  setVisibility(v: Visibility): this {
    this.visibility = v;
    return this;
  }

  setAbstract(a: boolean): this {
    this.abstract = a;
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

  setStatic(v: boolean = true): this {
    this.static = v;
    return this;
  };

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
    const asyncron = this.asynchronous ? 'async' : '';
    const params: string = this.params.map(p => `${p.name}: ${p.type}`).join(',');
    const combinedParams: string = params ? `${params}${this.jsonParams.size() ? `,${this.jsonParams.render()}` : ''}` : this.jsonParams.render();

    if (!this.name) {
      throw new Error(
        `member function missing function name: ${this.renderVisibility()} ${staticKeyword} ${asyncron} ${constant} ${this.name}(${combinedParams}) ${returnType} {...}`);
    }

    return `${this.renderVisibility()} ${staticKeyword} ${asyncron} ${constant} ${this.name}(${combinedParams}) ${returnType} {${super.render()}}`;
  }
}