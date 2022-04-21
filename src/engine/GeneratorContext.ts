import {SourceFile} from "./SourceFile";

export class GeneratorContext {
  private static instance;
  private files: Map<string, SourceFile> = new Map();

  static getInstance(): GeneratorContext {
    if (!GeneratorContext.instance) {
      GeneratorContext.instance = new GeneratorContext();
    }
    return GeneratorContext.instance;
  }

  getSources(): SourceFile[] {
    return Array.from(this.files.values());
  }

}