import {AbstractTsFunction} from "./AbstractTsFunction";

export class TsArrowFunction extends AbstractTsFunction {

  constructor( id?: string) {
    super(undefined,id);
  }

  render(): string {
    const asynchronous = this.asynchronous ? 'async ' : '';
    return `${asynchronous}(${this.params.map(param => `${param.name}${param.type ? `: ${param.type}` : ''}`).join(',')}) => {${super.render()}}`;
  }
}