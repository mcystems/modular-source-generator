import {Controller, DbEngine, DbType, Style, UI} from "./Support";

export interface Database{
  type: DbType;
  engine: DbEngine;
}

export interface Preferences {
  db: Database;
  controller: Controller;
  style: Style;
  ui: UI;
  state: string;
  i18n: string;
}