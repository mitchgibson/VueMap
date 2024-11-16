use convert_case::{Case, Casing};

pub fn to_pascal_case(s: &str) -> String {
  s.to_case(Case::Pascal)
}

pub fn to_kebab_case(s: &str) -> String {
  s.to_case(Case::Kebab)
}
