mod crawler;

use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use crawler::crawler::{crawl};
use serde_json::json;

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
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
  let nodes = crawl(dir.unwrap().as_str());

  let mut count =  0;
  let target = nodes.get(&component);
    match target {
        Some(target) => {
            println!("Component: {}", target.componentName);
            for location in target.locations.iter() {
                println!("{}:  - {}", target.componentName, location);
                count += 1;
            }
        },
        None => {
            println!("Component not found");
        }
    }
    
  HttpResponse::Ok().json(json!({
      "nodes": target,
      "count": count,
      "message": "Crawl completed successfully"
  }))
}

async fn manual_hello() -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(hello)
            .service(echo)
            .service(node)
            .route("/hey", web::get().to(manual_hello))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}