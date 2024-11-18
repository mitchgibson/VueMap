import { Location } from "./Location";

export type Component = {
  component_name: string;
  filename: string;
  locations: Location[];
  children: string[];
}