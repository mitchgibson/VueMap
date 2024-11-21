use serde::{Serialize, Deserialize};
use serde_json;
use std::fs;
use std::path::Path;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Scope {
    name: String,
    value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Settings {
    pub scopes: Vec<Scope>,
}

impl Settings {
    fn new() -> Self {
        Settings { scopes: Vec::new() }
    }
}

pub fn read_settings() -> Settings {
    let settings_path = Path::new("settings.json");
    
    if settings_path.exists() {
        match fs::read_to_string(settings_path) {
            Ok(settings_file) => {
                match serde_json::from_str(&settings_file) {
                    Ok(settings) => settings,
                    Err(_) => {
                        eprintln!("Failed to parse settings.json. Using default settings.");
                        Settings::new()
                    }
                }
            },
            Err(_) => {
                eprintln!("Failed to read settings.json. Using default settings.");
                Settings::new()
            }
        }
    } else {
        println!("settings.json not found. Using default settings.");
        Settings::new()
    }
}

pub fn write_settings(settings: &Settings) {
    let settings_file = serde_json::to_string_pretty(settings).unwrap();
    fs::write("settings.json", settings_file).unwrap();
}
