import {Visibility} from "../generic/Visibility";
import {AbstractTsFunction} from "./AbstractTsFunction";

export class TsFunction extends AbstractTsFunction {
  private visibility: Visibility;

  constructor(readonly name: string, readonly returnType: string, id?: string) {
    super(undefined, id);
  }

  setVisibility(v: Visibility): this {
    this.visibility = v;
    return this;
  }

  render(): string {
    const visibility = this.visibility === Visibility.PUBLIC ? 'export' : '';
    const asynchronous = this.asynchronous ? 'async' : '';
    return `${visibility} ${asynchronous} function ${this.name}(${this.params.map(p => `${p.name}: ${p.type}`).join()}): ${this.returnType} {
      ${super.render()}
    }`;
  }
}