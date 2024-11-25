mod crawler;
mod casing;
mod settings;

use std::process::Child;
use std::sync::Mutex;
use std::{process::Command, sync::Arc};
use actix_cors::Cors;
use actix_web::{get, http, post, web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;
use crawler::crawler::crawl;
use settings::settings::{read_settings, write_settings};
use serde_json::json;
use casing::casing::{to_kebab_case, to_pascal_case};
use ctrlc;

#[derive(Deserialize)]
struct NodesQuery {
    dir: Option<String>,
    filter: Option<String>,
    exact: Option<bool>,
}

#[get("/api/nodes")]
async fn nodes(query: web::Query<NodesQuery>) -> impl Responder {
  let dir = query.dir.clone();
  let filter = query.filter.clone();
  let exact = query.exact;
  
  let crawl_results = crawl(dir.unwrap().as_str());

  let mut filtered_crawl = crawl_results.clone();

  if let Some(f) = filter.as_ref().filter(|s| !s.is_empty()) {
      let pascal_case_filter = to_pascal_case(f);
      let kebab_case_filter = to_kebab_case(f);
      if exact.unwrap_or(false) {
          filtered_crawl.retain(|key, _| key == &pascal_case_filter || key == &kebab_case_filter);
      } else {
          filtered_crawl.retain(|key, _| key.contains(&pascal_case_filter) || key.contains(&kebab_case_filter));
      }
  }

  let response = json!({
      "message": "Crawl completed successfully",
      "count": filtered_crawl.len(),
      "nodes": filtered_crawl,
  });

  HttpResponse::Ok().json(response)
}

#[get("/api/settings")]
async fn get_settings() -> impl Responder {
  HttpResponse::Ok().json(read_settings())
}

#[post("/api/settings")]
async fn post_settings(settings: web::Json<settings::settings::Settings>) -> impl Responder {
  write_settings(&settings);
  HttpResponse::Ok().json(settings)
}

fn start_npm_process() -> Child {
  Command::new("npm")
      .args(&["run", "dev"])
      .current_dir("./ui")  // Adjust this path to where your package.json is
      .spawn()
      .expect("Failed to start npm run dev")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
  let npm_child = Arc::new(Mutex::new(start_npm_process()));

  let npm_child_clone = npm_child.clone();
  ctrlc::set_handler(move || {
      println!("Received Ctrl-C, stopping npm process...");
      if let Ok(mut child) = npm_child_clone.lock() {
          let _ = child.kill();
      }
      std::process::exit(0);
  }).expect("Error setting Ctrl-C handler");

  // thread::spawn(|| {
  //   let output = Command::new("npm")
  //       .args(&["run", "dev"])
  //       .current_dir("./ui")  // Adjust this path to where your package.json is
  //       .output()
  //       .expect("Failed to execute npm run dev");

  //   if !output.status.success() {
  //       eprintln!("npm run dev failed: {}", String::from_utf8_lossy(&output.stderr));
  //   }
  // }); 

  let server = HttpServer::new(move || {
      let cors = Cors::default()
          .allowed_origin("http://localhost:5173")
          .allow_any_method()
          .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
          .allowed_header(http::header::CONTENT_TYPE)
          .max_age(3600);

      App::new()
          .wrap(cors)
          .service(nodes)
          .service(get_settings)
          .service(post_settings)
        
  })
  .bind(("127.0.0.1", 3000))?
  .run();

  println!("Server running at http://127.0.0.1:3000/");
  println!("Client running at http://localhost:5173/");

  // Run the server and wait for it to finish
  server.await?;

  // Stop the npm process when the server stops
  if let Ok(mut child) = npm_child.lock() {
      println!("Stopping npm process...");
      let _ = child.kill();
  }

  Ok(())
}