import { DirectoryStruct } from "./Directory"

export type SettingsStruct = {
  scopes: DirectoryStruct[];
}

export function Settings(data: Partial<SettingsStruct> = {}): SettingsStruct {
  return {
    scopes: [],
    ...data
  }
}