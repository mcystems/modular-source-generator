import { Renderer } from "./Renderer";

let idCache: Map<string, Statement> = new Map();

export function resetStatementIdCache() {
  idCache = new Map();
}

export class Statement extends Renderer {
  private statement: string;
  private id?: string;

  constructor(st?: string, id?: string) {
    super();
    if (st !== undefined) {
      this.statement = st;
    }
    if (id) {
      const cached = idCache.get(id);
      if (cached) {
        throw new Error(`can not add statement with the same id twice: ${id}`);
      }
      idCache.set(id, this);
      this.id = id;
    }
  }

  getId(): string | undefined {
    return this.id;
  }

  setId(id: string): this {
    if (this.id) {
      return this;
    }
    if (id) {
      const cached = idCache.get(id);
      if (cached) {
        throw new Error(`can not add statement with the same id twice: ${id}`);
      }
      idCache.set(id, this);
      this.id = id;
    }
    return this;
  }

  render(): string {
    return this.statement;
  }

  setStatement(statement: string): void {
    this.statement = statement;
  }

  static findById(id: string): Statement | undefined {
    return idCache.get(id);
  }

  unregister(): this {
    if (this.id) {
      idCache.delete(this.id);
    }
    return this;
  }

  getStatement(): string {
    return this.statement;
  }
}
