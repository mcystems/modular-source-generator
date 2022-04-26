export interface ImportType {
  name: string;
  defaultImport: boolean;
}

enum ImportNameState {
  NAME, LCB, RCB, COMMA, WHITESPACE
}

export class Imports {
  private readonly fromImports: Map<string, Map<string, ImportType>> = new Map();

  add(name: string, from: string): void {
    let imprt: Map<string, ImportType> | undefined = this.fromImports.get(from);
    const imports: ImportType[] = this.parseImportName(name);
    if (!imprt) {
      imprt = new Map();
      this.fromImports.set(from, imprt);
    }
    // @ts-ignore
    imports.forEach(i => imprt.set(i.name, i));
  }

  private parseImportName = (name: string): ImportType[] => {
    let currentName = '';
    let defaultImport = true;
    let types: ImportType[] = [];
    let state: ImportNameState | null = null;
    for (let i = 0; i < name.length; i++) {
      if (name.charAt(i) === ',') {
        if (state === ImportNameState.COMMA) {
          throw new Error('double comma in import declaration');
        }
        state = ImportNameState.COMMA;
        types.push({
          name: currentName,
          defaultImport
        });
        currentName = '';
      } else if (name.charAt(i) === '{') {
        if (state === ImportNameState.LCB) {
          throw new Error('unexpected {');
        } else if (state === ImportNameState.NAME) {
          throw new Error("invalid character '{' in name: " + name);
        }
        state = ImportNameState.LCB;
        defaultImport = false;
      } else if (name.charAt(i) === '}') {
        if (state === ImportNameState.LCB) {
          throw new Error('empty import');
        } else if (state === ImportNameState.RCB) {
          throw new Error('unexpected }: ' + name);
        }
        state = ImportNameState.RCB;
        types.push({
          name: currentName,
          defaultImport
        });
        currentName = '';
        defaultImport = true;
      } else if (name.charAt(i).match(/\s/)) {
        if (state === ImportNameState.NAME) {
          throw new Error('name can not contain whitespace: ' + name);
        }
        state = ImportNameState.WHITESPACE;
      } else {
        state = ImportNameState.NAME;
        currentName += name.charAt(i);
      }
    }
    if (state === ImportNameState.NAME) {
      types.push({
        name: currentName,
        defaultImport
      });
    }
    return types;
  }

  getImportStatements(): string {
    return Array.from(this.fromImports.entries()).map((i: [string, Map<string, ImportType>]) => {
      const defaultImports = Array.from(i[1].values()).filter(f => f.defaultImport);
      const nonDefaultImports = Array.from(i[1].values()).filter(f => !f.defaultImport);
      const x: string[] = [];
      if (defaultImports.length > 0) {
        x.push(defaultImports.map(i => i.name).join());
      }
      if (nonDefaultImports.length > 0) {
        x.push('{' + nonDefaultImports.map(i => i.name).join() + '}');
      }
      return `import ${x.join()} from '${i[0]}';`;
    }).join('\n')
  }

  merge(other: Imports): void {
    for (let i of Array.from(other.fromImports.entries())) {
      let imprt = this.fromImports.get(i[0]);
      if (!imprt) {
        imprt = new Map();
        this.fromImports.set(i[0], imprt);
      }
      for (let j of Array.from(i[1].values())) {
        imprt.set(j.name, j);
      }
    }
  }
}
