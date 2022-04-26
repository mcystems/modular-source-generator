import {CharacterPosition} from "xml2ts/dist/xmlTsNode";
import {Method} from "./Method";

export interface Api {
  name?: string,
  version?: number,
  disabled?: boolean,
  role?: string,
  methods: Method[],
  pos: CharacterPosition
}