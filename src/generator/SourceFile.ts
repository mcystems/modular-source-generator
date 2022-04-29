import {SourceType} from "./SourceType";

export interface SourceFile {
  name: string;
  location: string;
  type: SourceType;

  render(): string;
}