use clap::Parser;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    #[arg(short='D', long="dir")]
    dir: Option<String>,
    #[arg(short='C', long="component")]
    component: Option<String>,
}

pub struct Config {
  pub dir: String,
  pub component: String,
}

impl Config {
  pub fn new() -> Result<Self, std::io::Error> {
      let args = Args::parse();
      let dir = Config::pick_dir(&args)?;
      let component = Config::pick_component(&args)?;

      Ok(Config {
          dir,
          component,
      })
  }

  pub fn dir(&self) -> &str {
      &self.dir
  }
  
  fn pick_dir(args: &Args) -> Result<String, std::io::Error> {
    match &args.dir {
        Some(dir) => Ok(dir.clone()),
        None => std::env::current_dir().map(|path| path.to_str().unwrap().to_string())
    }
  }

  pub fn component(&self) -> &str {
      &self.component
  }

  fn pick_component(args: &Args) -> Result<String, std::io::Error> {
    match &args.component {
        Some(component) => Ok(component.clone()),
        None => Ok("".to_string())
    }
  }
}