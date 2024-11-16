mod crawler;
mod casing;
mod grapher;

use actix_cors::Cors;
use actix_web::{get, http, web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;
use crawler::crawler::{crawl, Node};
use serde_json::json;
use casing::casing::{to_kebab_case, to_pascal_case};
use grapher::grapher::build_graph;

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

  let graph = build_graph(crawl_results.clone(), |n| {
      if let Some(f) = filter.as_ref() {
          let pascal_case_filter = to_pascal_case(f);
          let kebab_case_filter = to_kebab_case(f);
          if exact.unwrap_or(false) {
              n.component_name == pascal_case_filter || n.component_name == kebab_case_filter
          } else {
              n.component_name.contains(&pascal_case_filter) || n.component_name.contains(&kebab_case_filter)
          }
      } else {
          true // If no filter is provided, include all nodes
      }
  });

  let response = json!({
      "message": "Crawl completed successfully",
      "count": filtered_crawl.len(),
      "nodes": filtered_crawl,
      "graph": graph,
  });

  HttpResponse::Ok().json(response)
}

#[derive(Deserialize)]
struct NodeQuery {
    dir: Option<String>,
    // Add other query parameters as needed
}

#[get("/node/{component}")]
async fn node(path: web::Path<String>, query: web::Query<NodeQuery>,) -> impl Responder {
  let component = path.into_inner();
  let dir = query.dir.clone();
  let crawl_results = crawl(dir.unwrap().as_str());

  let mut count =  0;
  let target = crawl_results.get(&component);
    match target {
        Some(target) => {
            count += target.locations.len();
        },
        None => {
            println!("Component not found");
        }
    }
    
  HttpResponse::Ok().json(json!({
    "count": count,
    "message": "Crawl completed successfully",
    "node": target,
  }))
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
        .service(node)
})
.bind(("127.0.0.1", 3000))?
.run()
.await
}