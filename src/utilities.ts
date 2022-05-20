
export const forceArray = <T>(node: T | T[] | undefined): T[] => !node ? [] : Array.isArray(node) ? node : [node];

export type EnumType = { [s: string]: string };

export function enumValueKeyMapper(enumeration: EnumType): Map<string, string> {
  return new Map(Object.entries(enumeration).map(e=> {
    return [e[1], enumeration[e[0]]];
  }));
}