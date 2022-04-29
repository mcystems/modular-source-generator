import {DbEngineFactory} from "../engine/DbEngineFactory";
import {Data} from "../model/data/Data";
import {Enumeration} from "../model/data/Enumeration";

let instance: ProjectBuilder | undefined;

export class ProjectBuilder {

  private readonly dbEngineFactory = new DbEngineFactory();

  static getInstance(): ProjectBuilder {
    if (!instance) {
      instance = new ProjectBuilder();
    }
    return instance;
  }

  fireDataEvent(data: Data) {
    const engine = this.dbEngineFactory.createDbEngine();
    engine.handleEvent(data);
  }

  fireEnumerationEvent(enumeration: Enumeration) {

  }
}