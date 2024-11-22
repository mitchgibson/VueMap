export type LocationStruct = {
  path: string;
  filename: string;
  package: string;
  component: string;
}

export function Location(data: Partial<LocationStruct> = {}) {
  return {
    path: '',
    filename: '',
    package: '',
    component: '',
    ...data
  }
}