export type DirectoryStruct = {
  name: string;
  value: string;
};

export function Directory(data: Partial<DirectoryStruct> = {}) {
  return {
    name: '',
    value: '',
    ...data
  }
}