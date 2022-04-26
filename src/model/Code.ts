import {CharacterPosition} from "xml2ts/dist/xmlTsNode";

export interface Code {
  event: string;
  transactional?: boolean;
  code: string;
  pos: CharacterPosition;
}