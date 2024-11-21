mod crawler;
mod casing;
mod settings;

use actix_cors::Cors;
use actix_web::{get, post, http, web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;
use crawler::crawler::crawl;
use settings::settings::{read_settings, write_settings};
use serde_json::json;
use casing::casing::{to_kebab_case, to_pascal_case};

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[derive(Deserialize)]
struct NodesQuery {
    dir: Option<String>,
    filter: Option<String>,
    exact: Option<bool>,
}

#[get("/nodes")]
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

#[get("/settings")]
async fn get_settings() -> impl Responder {
  HttpResponse::Ok().json(read_settings())
}

#[post("/settings")]
async fn post_settings(settings: web::Json<settings::settings::Settings>) -> impl Responder {
  write_settings(&settings);
  HttpResponse::Ok().json(settings)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {

    // TODO: Add feature where it will show the component tree from the perspective of the targeted component. Start with showing up the tree, but can also do down the tree later
  HttpServer::new(|| {
    let cors = Cors::default()
        .allowed_origin("http://localhost:5173")
        .allow_any_method() // This line allows all HTTP methods
        .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
        .allowed_header(http::header::CONTENT_TYPE)
        .max_age(3600);

    App::new()
        .wrap(cors)
        .service(hello)
        .service(nodes)
        .service(get_settings)
        .service(post_settings)
})
.bind(("127.0.0.1", 3000))?
.run()
.await
}