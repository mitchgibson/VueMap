mod crawler;

use actix_cors::Cors;
use actix_web::{get, http, post, web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize};
use crawler::crawler::{crawl};
use serde_json::json;
use convert_case::{Case, Casing};

fn to_pascal_case(s: &str) -> String {
    s.to_case(Case::Pascal)
}

fn to_kebab_case(s: &str) -> String {
    s.to_case(Case::Kebab)
}

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
    let exact = query.exact.clone();
    
    let mut crawl_results = crawl(dir.unwrap().as_str());

    if let Some(f) = filter.filter(|s| !s.is_empty()) {
        let pascal_case_filter = to_pascal_case(&f);
        let kebab_case_filter = to_kebab_case(&f);
        if exact.unwrap() {
            crawl_results.retain(|key, _| key == &pascal_case_filter || key == &kebab_case_filter);
        }
        else {
            crawl_results.retain(|key, _| key.contains(&pascal_case_filter) || key.contains(&kebab_case_filter));
        }
        
    }

    let response = json!({
      "message": "Crawl completed successfully",
      "count": crawl_results.len(),
      "nodes": crawl_results,
    });

    HttpResponse::Ok().json(response)
}

#[derive(Deserialize)]
struct NodeQuery {
    dir: Option<String>,
    // Add other query parameters as needed
}

#[get("/node/{component}")]
async fn node(path: web::Path<(String)>, query: web::Query<NodeQuery>,) -> impl Responder {
  let (component) = path.into_inner();
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
.bind(("127.0.0.1", 8080))?
.run()
.await
}