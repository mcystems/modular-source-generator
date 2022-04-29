import {SourceFile} from "./SourceFile";
import {SourceType} from "./SourceType";
import {Dependency} from "./Dependency";

export class GeneratorContext {
  private static instance;
  private files: Map<string, SourceFile> = new Map();
  private dependencies: Map<SourceType, Dependency[]> = new Map();
  private messages: string[] = [];

  static getInstance(): GeneratorContext {
    if (!GeneratorContext.instance) {
      GeneratorContext.instance = new GeneratorContext();
    }
    return GeneratorContext.instance;
  }

  getSources(): SourceFile[] {
    return Array.from(this.files.values());
  }

  getSource(id: string): SourceFile | undefined {
    return this.files.get(id);
  }

  setSource(id: string, src: SourceFile): this {
    this.files.set(id, src);
    return this;
  }

  setProjectDependencies(type: SourceType, dep: Dependency[]): this {
    let depArray = this.dependencies.get(type);
    if (!depArray) {
      depArray = [];
      this.dependencies.set(type, depArray);
    }
    depArray.push(...dep);
    return this;
  }

  addMessagesToUser(msg: string): this {
    this.messages.push(msg);
    return this;
  }

}