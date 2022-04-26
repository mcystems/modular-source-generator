import {Statement} from "./Statement";

export class PlaceholderStatement extends Statement {
  constructor(id: string) {
    super('', id);
  }
}