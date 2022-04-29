import {AbstractTsFunction} from "./AbstractTsFunction";

export class TsFunction extends AbstractTsFunction {
  private exporting: boolean;

  constructor(readonly name: string, readonly returnType: string, id?: string) {
    super(undefined, id);
  }

  setExport(v: boolean = true): this {
    this.exporting = v;
    return this;
  }

  render(): string {
    const visibility = this.exporting ? 'export' : '';
    const asynchronous = this.asynchronous ? 'async' : '';
    return `${visibility} ${asynchronous} function ${this.name}(${this.params.map(p => `${p.name}: ${p.type}`).join()}): ${this.returnType} {
      ${super.render()}
    }`;
  }
}