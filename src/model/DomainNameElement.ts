export interface DomainNameElement {
  domain: string;
  name: string;
}

export interface DomainNameFieldElement extends DomainNameElement {
  fieldName: string;
}

export function domainNameOf(e: DomainNameElement): string {
  return `${e.domain}.${e.name}`
}