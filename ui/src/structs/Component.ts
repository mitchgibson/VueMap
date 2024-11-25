
import { LocationStruct } from "./Location";

export type ComponentStruct = {
  component_name: string;
  filename: string;
  locations: LocationStruct[];
  children: string[];
}

export function Component(data: Partial<ComponentStruct> = {}) {
  return {
    component_name: '',
    filename: '',
    locations: [],
    children: [],
    ...data
  }
}