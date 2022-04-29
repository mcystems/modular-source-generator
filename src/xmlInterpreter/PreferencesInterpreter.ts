import {XmlTsNode} from "xml2ts/dist/xmlTsNode";
import {Preferences} from "../model/application/Preferences";
import {XmlError} from "./XmlError";
import {checkAttrAndValueInEnum} from "./Interpreter";
import {Controller, DbEngine, DbType, I18N, State, Style, UI} from "../model/application/Support";


export class PreferencesInterpreter {

  static interpret(node: XmlTsNode): Preferences {
    if (!node.technology) {
      throw new XmlError(`technology node is missing`, node);
    }
    const technology = node.technology;

    const controller = checkAttrAndValueInEnum("controller", technology, Controller, false);
    const style = checkAttrAndValueInEnum("style", technology, Style, false);
    const ui = checkAttrAndValueInEnum("ui", technology, UI, false);
    const state = checkAttrAndValueInEnum("state", technology, State, false);
    const i18n = checkAttrAndValueInEnum("i18n", technology, I18N, false);
    if (!node.db) {
      throw new XmlError(`database configuration node is required`, node);
    }
    const dbEngine = checkAttrAndValueInEnum("engine", node.db, DbEngine, false);
    const dbType = checkAttrAndValueInEnum("type", node.db, DbType, false);

    return {
      db: {
        engine: DbEngine[dbEngine],
        type: DbType[dbType]
      },
      controller: Controller[controller],
      style: Style[style],
      ui: UI[ui],
      state: State[state],
      i18n: I18N[i18n]
    }
  }
}