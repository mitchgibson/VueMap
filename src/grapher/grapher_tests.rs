use super::crawler;
use std::io::{self, Write};
use std::path::Path;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_should_build_graph_from_hash_table() {
        let hash_table = crawler::crawl("/Users/mitchdelachevrotiere/mdgibson/rust/crawler/test-assets/src/html-page");
        let graph = grapher::grapher::build_graph(hash_table);
        assert!(graph.nodes.len() > 0, "The graph should have nodes");
        assert!(graph.edges.len() > 0, "The graph should have edges");
    }
}
