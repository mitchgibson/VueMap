mod config;
mod crawler;

use config::Config;
use crawler::crawler::crawl;

fn main() -> std::io::Result<()> {

    let config = match Config::new() {
        Ok(config) => config,
        Err(error) => {
            eprintln!("Error: {}", error);
            return Err(error);
        }
    };

    let nodes = crawl(config.dir());
    println!("{:?}", nodes);

    println!("dir: {}", config.dir());
    println!("component: {}", config.component());

    // find the node by key of component
    let node = nodes.get(config.component());
    let mut count =  0;
    match node {
        Some(node) => {
            println!("Component: {}", node.componentName);
            for location in node.locations.iter() {
                println!("{}:  - {}", node.componentName, location);
                count += 1;
            }
        },
        None => {
            println!("Component not found");
        }
    }

    println!("Found {} uses", count);

    Ok(())
}

