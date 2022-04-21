import {ProgrammingLanguage} from "./ProgrammingLanguage";

export interface Dependency {
  name: string;
  version: string;
}

export interface Engine {
  getProgrammingLanguage(): ProgrammingLanguage;
  getCapabilities(): string[];
  getDependencies(): Dependency[];
}