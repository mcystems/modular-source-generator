import {expect, should} from "chai";

type ImportLine = { from: string, items: string[] };

interface TsSource {
  imports: Map<string, Set<string>>,
  origImports: string,
  whitespaceTrimmedSource: string
}

function translateSourceFile(src: string): TsSource {
  const lines = src.split('\n');
  let whitespaceTrimmedSource = '';
  let imports: Map<string, Set<string>> = new Map();
  const origImports: string[] = [];
  for (let line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("import")) {
      origImports.push(trimmedLine);
      const items = trimmedLine.substring(trimmedLine.lastIndexOf("import"), trimmedLine.indexOf("from")).replace(/[{}]/g, "").split(",");
      let set = imports.get(trimmedLine.substring(trimmedLine.lastIndexOf("from")));
      if (!set) {
        set = new Set();
        imports.set(trimmedLine.substring(trimmedLine.lastIndexOf("from")), set);
      }
      // @ts-ignore
      items.forEach(i => set.add(i));
    } else {
      const s = trimmedLine.replace(/\s*/g, '').trim();
      if(s.length>0) {
        whitespaceTrimmedSource += s;
      }
    }
  }
  return {
    imports,
    origImports: origImports.join('\n'),
    whitespaceTrimmedSource
  }
}


export function expectTsCodeEq(expected: string, got: string): void {
  const src = translateSourceFile(expected);
  const cmp = translateSourceFile(got);

  let succeed = true;
  src.imports.forEach((v, k) => {
    succeed = v.size === cmp.imports.get(k)?.size && Array.from(v.values()).every(val => cmp.imports.get(k)?.has(val));
  });
  if (!succeed) {
    expect(src.origImports).eq(cmp.origImports);
  }
  expect(src.whitespaceTrimmedSource).eq(cmp.whitespaceTrimmedSource);
}