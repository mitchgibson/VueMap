use std::fs;
use std::path::PathBuf;
use std::collections::HashMap;
use serde::Serialize;
use crate::casing::casing::to_kebab_case;

#[derive(Debug, PartialEq, Serialize, Clone)]
pub struct Location {
    pub path: String,
    pub filename: String,
    pub package: String,
    pub component: String,
}

#[derive(Debug, PartialEq, Serialize, Clone)]
pub struct Node {
    pub component_name: String,
    pub filename: String,
    pub locations: Vec<Location>,
    pub children: Vec<String>,
}

pub fn get_all_file_paths(dir: &str) -> Vec<PathBuf> {
  let mut file_paths = Vec::new();
  
  if let Ok(entries) = fs::read_dir(dir) {
      for entry in entries {
          if let Ok(entry) = entry {
              let path = entry.path();
              if path.is_dir() {
                  // Recursively get files from subdirectories
                  file_paths.extend(get_all_file_paths(path.to_str().unwrap()));
              } else if path.extension().map_or(false, |ext| ext == "vue") {
                  // Only include files with .vue extension
                  file_paths.push(path);
              }
          }
      }
  }

  file_paths    
}

pub fn crawl(dir: &str) -> HashMap<String, Node> {
    let dirs = dir.split(',');
    let mut file_paths: Vec<PathBuf> = Vec::new();
    for _dir in dirs {
        file_paths.extend(get_all_file_paths(_dir));
    }

    let mut nodes: HashMap<String, Node> = HashMap::new();

    for file_path in file_paths {
        let content = fs::read_to_string(&file_path).expect("Unable to read file");
        let template_block = extract_template_block(&content);

        if template_block.is_empty() {
            continue;
        }
        let components = extract_components(&template_block);

        if components.len() > 0 {
            let file_path_str = file_path.display().to_string();
            let filename = &extract_filename(&file_path_str);
            for component in components.iter() {
                if !nodes.contains_key(component) {
                    nodes.insert(component.clone(), Node {
                        filename: filename.to_string(),
                        component_name: component.clone(),
                        locations: vec![Location {
                            path: file_path_str.clone(),
                            filename: filename.to_string(),
                            package: extract_package(&file_path_str),
                            component: filename_to_kebab(filename),
                        }],
                        children: Vec::new(),
                    });
                } else {
                    let node = nodes.get_mut(component).unwrap();
                    node.locations.push(Location {
                        path: file_path_str.clone(),
                        filename: extract_filename(&file_path_str),
                        package: extract_package(&file_path_str),
                        component: filename_to_kebab(filename),
                    });
                }
            }
        }
    }

    let keys: Vec<String> = nodes.keys().cloned().collect();
    for key_1 in keys.iter() {
        for key_2 in keys.iter() {
            if key_1 == key_2 {
                continue;
            }
            let node = nodes.get_mut(key_2).unwrap();
            if node.locations.iter().any(|location| location.component == *key_1) {
                let node_1 = nodes.get_mut(key_1).unwrap();
                node_1.children.push(key_2.clone());
            }
        }
    }

    nodes
} 

fn extract_package(path: &str) -> String {
    let package = if path.contains("packages/enterprise") {
        "enterprise"
    } else if path.contains("packages/builder") {
        "builder"
    } else if path.contains("packages/kui") {
        "kui"
    } else {
        "unknown"
    };

    package.to_string()
}

fn filename_to_kebab(filename: &str) -> String {
    let component_name = filename.split('.').next().unwrap().to_string();
    to_kebab_case(&component_name)
}

fn extract_filename(path: &str) -> String {
    let path_str = path.to_string();
    let path_str_split: Vec<&str> = path_str.split('/').collect();
    let filename = path_str_split.last().unwrap();
    filename.to_string()
}

fn extract_template_block(content: &str) -> String {
    let start_tag = "<template";
    let end_tag = "</template>";

    if let (Some(start_index), Some(end_index)) = (content.find(start_tag), content.rfind(end_tag)) {
        if start_index < end_index {
            return content[start_index..=end_index + end_tag.len() - 1].to_string();
        }
    }

    String::new()
}

fn tag_filter(tag: &str) -> bool {
    tag.starts_with('/') 
    || is_valid_html_tag(tag) 
    || tag.starts_with('!')
    || tag.starts_with('?') 
    || tag.starts_with('@') 
    || tag.starts_with('#') 
    || tag.starts_with("{{")
    || tag.is_empty()
    || tag == "slot"
}

fn extract_components(content: &str) -> Vec<String> {
    let mut components = Vec::new();
    let mut start_index = 0;

    while let Some(start) = content[start_index..].find('<') {
        let start = start_index + start;
        if let Some(end) = content[start + 1..].find(|c| c == '>' || c == ' ' || c == '/') {
            let end = start + 1 + end;
            let tag = content[start + 1..end].trim().to_string();
            // Ignore end tags and HTML void elements
            if !tag_filter(&tag) && !components.contains(&tag) {
                let component_name = tag.split_whitespace().next().unwrap_or(&tag).to_string();
                components.push(to_kebab_case(component_name.as_str()));
            }

            start_index = end;
        } else {
            // If no closing bracket is found, break the loop
            break;
        }
    }

    components
}

const HTML_TAGS: &[&str] = &[
    "a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "map", "mark", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr"
];

fn is_valid_html_tag(tag: &str) -> bool {
    HTML_TAGS.contains(&tag)
}

