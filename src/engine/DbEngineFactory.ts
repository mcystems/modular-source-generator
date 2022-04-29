import {Engine} from "../engine/Engine";
import {Data} from "../model/data/Data";
import {ModelCache} from "../model/ModelCache";
import {DbEngine} from "../model/application/Support";
import {KnexDbEngine} from "../engine/backend/db/KnexDbEngine";


export class DbEngineFactory {

  createDbEngine(): Engine<Data> {
    const pref = ModelCache.getInstance().getPreferences();
    if (!pref) {
      throw new Error(`preferences are not set`);
    }
    switch (pref.db.engine) {
      case DbEngine.KNEX:
        return KnexDbEngine.getInstance();
      default:
        throw new Error(`${pref.db.engine}  database engine is not defined`);
    }
  }
}