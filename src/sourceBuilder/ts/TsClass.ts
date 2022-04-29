import {ClassLike} from "./ClassLike";
import {Visibility} from "../generic/Visibility";


export class TsClass extends ClassLike<string> {
  private abstract: boolean;
  private implements: string[] = [];

  constructor(id?: string) {
    super('', id);
  }

  setAbstract(v: boolean): this {
    this.abstract = v;
    return this;
  }

  addImplements(impl: string): this {
    this.implements.push(impl);
    return this;
  }

  protected renderInherits(): string {
    let rendering = '';
    if (this.extends) {
      rendering = ` extends ${this.extends} `
    }
    if (this.implements.length > 0) {
      rendering += ` implements ${this.implements.join()} `;
    }
    return rendering;
  }

  setExtends(e: string): this {
    this.extends = e;
    return this;
  }

  render(): string {
    const inherits = this.renderInherits();
    const exportClass = this.visibility === Visibility.PUBLIC ? 'export' : '';
    const abstractClass = this.abstract ? 'abstract' : '';
    return `${exportClass} ${abstractClass} class ${this.name} ${inherits} {
      ${this.members.render()}
    }`;
  }
}

