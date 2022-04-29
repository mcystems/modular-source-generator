import { ClassLike } from "./ClassLike";
import {Visibility} from "../generic/Visibility";

export class TsInterface extends ClassLike<Array<string>> {
  constructor() {
    super('');
  }

  setName(v: string): this {
    this.name = v;
    return this;
  }

  setExport(): this {
    return this.setVisibility(Visibility.PUBLIC);
  }

  addExtends(s: string): this {
    this.extends.push(s);
    return this;
  }

  renderInherits(): string {
    let rendering = '';
    if (this.extends?.length > 0) {
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