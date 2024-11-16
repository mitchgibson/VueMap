use std::collections::{HashMap, HashSet};
use crate::crawler::crawler::Node;
use crate::casing::casing::to_kebab_case;
use serde::Serialize;

#[derive(Debug, PartialEq, Serialize, Clone)]
pub struct Graph {
    pub nodes: Vec<GraphNode>,
    pub edges: Vec<Edge>,
}

#[derive(Debug, PartialEq, Serialize, Clone)]
pub struct GraphNode {
    pub id: String,
    pub data: GraphNodeData,
    pub position: Position,
}

#[derive(Debug, PartialEq, Serialize, Clone)]
pub struct GraphNodeData {
    pub label: String,
}

#[derive(Debug, PartialEq, Serialize, Clone)]
pub struct Position {
    pub x: i32,
    pub y: i32,
}

#[derive(Debug, PartialEq, Serialize, Clone)]
pub struct Edge {
    pub id: String,
    pub source: String,
    pub target: String,
}

pub fn build_graph<F>(hash_table: HashMap<String, Node>, filter: F) -> (Graph, HashSet<String>)
where
    F: Fn(&Node) -> bool,
{
    let mut nodes: Vec<GraphNode> = Vec::new();
    let mut edges: Vec<Edge> = Vec::new();
    let mut component_to_id: HashMap<String, String> = HashMap::new();
    let mut connected_nodes: HashSet<String> = HashSet::new();

    // First pass: create nodes and build component_to_id map
    for (key, value) in hash_table.iter() {
        if filter(value) {
            let component_name = to_kebab_case(&value.component_name);
            component_to_id.insert(component_name.clone(), key.clone());
            
            nodes.push(GraphNode {
                id: key.clone(),
                data: GraphNodeData {
                    label: value.component_name.clone(),
                },
                position: Position { x: 0, y: 0 },
            });
            connected_nodes.insert(key.clone());
        }
    }

    // Second pass: create edges and add connected nodes
    for (key, value) in hash_table.iter() {
        if filter(value) || connected_nodes.contains(key) {
            for location in value.locations.iter() {
                let source = key.clone();
                let target_component = file_name_to_component_name(&location.filename);
                if let Some(target) = component_to_id.get(&target_component) {
                    let id = format!("{}->{}", source, target);
                    edges.push(Edge {
                        id,
                        source,
                        target: target.clone(),
                    });
                    connected_nodes.insert(target.clone());
                }
            }
        }
    }

    // Filter nodes to keep only connected ones
    nodes.retain(|node| connected_nodes.contains(&node.id));

    let graph = Graph { nodes, edges };
    let positioned_graph = set_node_x_y(graph);

    (positioned_graph, connected_nodes)
}

fn file_name_to_component_name(file_name: &str) -> String {
    let component_name = file_name.split('.').next().unwrap().to_string();
    to_kebab_case(&component_name)
}

pub fn set_node_x_y(graph: Graph) -> Graph {
    let mut levels: HashMap<String, usize> = HashMap::new();
    let mut visited: HashSet<String> = HashSet::new();

    // Assign levels to nodes
    for node in &graph.nodes {
        if !visited.contains(&node.id) {
            assign_levels(node, &graph.edges, &mut levels, &mut visited, 0);
        }
    }

    // Find the maximum level
    let max_level = levels.values().max().cloned().unwrap_or(0);

    // Calculate x and y positions
    let vertical_spacing = 100;
    let horizontal_spacing = 200;
    let mut level_counts: Vec<usize> = vec![0; max_level + 1];

    let new_nodes: Vec<GraphNode> = graph.nodes.into_iter().map(|mut node| {
        let level = levels.get(&node.id).cloned().unwrap_or(0);
        let count = level_counts[level];
        
        node.position.y = (level as i32) * vertical_spacing;
        node.position.x = (count as i32) * horizontal_spacing;

        level_counts[level] += 1;
        node
    }).collect();

    Graph {
        nodes: new_nodes,
        edges: graph.edges,
    }
}

fn assign_levels(
    node: &GraphNode,
    edges: &[Edge],
    levels: &mut HashMap<String, usize>,
    visited: &mut HashSet<String>,
    current_level: usize,
) {
    visited.insert(node.id.clone());
    levels.insert(node.id.clone(), current_level);

    for edge in edges.iter().filter(|e| e.source == node.id) {
        if !visited.contains(&edge.target) {
            let target_node = GraphNode {
                id: edge.target.clone(),
                data: GraphNodeData { label: edge.target.clone() },
                position: Position { x: 0, y: 0 }
            };
            assign_levels(&target_node, edges, levels, visited, current_level + 1);
        }
    }
}