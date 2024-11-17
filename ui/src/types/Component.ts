import { Location } from "./Location";

export type Component = {
  component_name: string;
  locations: Location[];
  children: string[];
}