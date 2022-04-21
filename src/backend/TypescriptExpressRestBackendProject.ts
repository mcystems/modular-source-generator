import {Dependency, Engine} from "../engine/Engine";
import {ProgrammingLanguage} from "../engine/ProgrammingLanguage";

export class TypescriptExpressRestBackendProject implements Engine {

  getCapabilities(): string[] {
    return [];
  }

  getDependencies(): Dependency[] {
    return [];
  }

  getProgrammingLanguage(): ProgrammingLanguage {
    return ProgrammingLanguage.TYPESCRIPT;
  }
}