import {MethodName} from "./MethodName";

export interface Method {
  readonly name: MethodName
  readonly disabled: boolean
  readonly role: string
}