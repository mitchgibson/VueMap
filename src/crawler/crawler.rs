use std::fs;
use std::path::PathBuf;
use std::collections::HashMap;
use serde::Serialize;

#[derive(Debug)]
pub struct ComponentCount {
    pub name: String,
    pub count: usize,
}

#[derive(Debug, PartialEq, Serialize)]
pub struct Node {
    pub componentName: String,
    pub locations: Vec<String>,
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
  
  println!("File paths: {:?}", file_paths);

  file_paths    
}

// Example usage
pub fn print_all_file_paths() {
    let dir = "/Users/mitchdelachevrotiere/dev/knak/packages/builder/src";
    let file_paths = get_all_file_paths(dir);
    
    for path in file_paths {
        println!("{}", path.display());
    }
}

pub fn crawl(dir: &str) -> HashMap<String, Node> {
    let file_paths = get_all_file_paths(dir);

    let mut nodes: HashMap<String, Node> = HashMap::new();

    for file_path in file_paths {
        let content = fs::read_to_string(&file_path).expect("Unable to read file");
        let template_block = extract_template_block(&content);

        let components = extract_components(&template_block);

        if(components.len() > 0) {
            let file_path_str = file_path.display().to_string();
            for component in components.iter() {
                if !nodes.contains_key(component) {
                    nodes.insert(component.clone(), Node {
                        componentName: component.clone(),
                        locations: vec![file_path_str.clone()]
                    });
                } else {
                    let node = nodes.get_mut(component).unwrap();
                    node.locations.push(file_path_str.clone());
                }
            }
        }
    }
    nodes
}

pub fn print_nodes(nodes: &HashMap<String, Node>) {
    for (key, value) in nodes.iter() {
        for location in value.locations.iter() {
            println!("  - {}", location);
        }
    }
}   

fn component_filter(component: &ComponentCount) -> bool {
    // filter out components with names that start with /
    !component.name.starts_with("/") && !is_valid_html_tag(&component.name)
}

fn extract_template_block(content: &str) -> String {
    // template block should look like this in the file <template>...</template>
    let start_tag = "<template";
    let end_tag = "</template>";

    // if no template block is found, return an empty string
    if !content.contains(start_tag) || !content.contains(end_tag) {
        return String::new();
    }
    let start_index = content.find(start_tag).expect("Template block not found") + start_tag.len();
    let end_index = content.find(end_tag).expect("Template block not found");

    content[start_index..end_index].to_string()
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
            if !tag.starts_with('/') && !is_valid_html_tag(&tag) {
                // Handle self-closing tags and tags with attributes
                let component_name = tag.split_whitespace().next().unwrap_or(&tag).to_string();
                components.push(component_name);
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

