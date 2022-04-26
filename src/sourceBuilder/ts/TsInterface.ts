import {Visibility} from "sourceBuilder/generic/Visibility";
import {ClassLike} from "sourceBuilder/ts/ClassLike";

export class TsInterface extends ClassLike<Array<string>> {
  constructor(priority: number) {
    super('');
  }

  setName(v: string): this {
    this.name = v;
    return this;
  }

  setVisibility(v: Visibility): this {
    this.visibility = v;
    return this;
  }

  addExtends(s: string): this {
    this.extends.push(s);
    return this;
  }

  renderInherits(): string {
    let rendering = '';
    if (this.extends.length > 0) {
      rendering = ` extends ${this.extends.join()} `
    }
    return rendering;
  }

  render(): string {
    const inherits = this.renderInherits();
    const exportClass = this.visibility === Visibility.PUBLIC ? 'export' : '';
    return `${exportClass} interface ${this.name} ${inherits} {
      ${this.members.render()}
    }`;
  }

}