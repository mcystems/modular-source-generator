import {CharacterPosition} from "xml2ts/dist/xmlTsNode";

export class CompileError extends Error {
  constructor(message: string, pos: CharacterPosition) {
    super(JSON.stringify({
      'message': message,
      'position': pos
    }));
  }
}