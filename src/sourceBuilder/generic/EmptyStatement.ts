import {Statement} from "./Statement";

export class EmptyStatement extends Statement{

  render(): string {
    return '';
  }
}