use super::crawler;
use std::io::{self, Write};
use std::path::Path;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_should_find_html_page() {
        let nodes = crawler::crawl("/Users/mitchdelachevrotiere/mdgibson/rust/crawler/test-assets/src");
        let html_page = nodes.get("html-page");
        assert!(html_page.is_some(), "The html-page component should be found");
    }
}
