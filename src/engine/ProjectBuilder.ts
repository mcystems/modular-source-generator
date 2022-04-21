import {Engine} from "./Engine";

let instance: ProjectBuilder | undefined;

export class ProjectBuilder {

  private engines: Map<string, Engine> = new Map();

  static getInstance(): ProjectBuilder {
    if (!instance) {
      instance = new ProjectBuilder();
    }
    return instance;
  }


  registerEngine(id: string, engine: Engine) {
    this.engines.set(id, engine);
  }
}