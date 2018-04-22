import Foundation

// (Contrast this file with ../java/src/plang/JavaHasNoAssociatedTypes.java)

// ------ Associated Types in Swift ------

// Here Graph has two associated types: Node and Edge. This is superficially similar
// to Graph<Node,Edge> in Java -- but different in a few important ways!

protocol Graph {
    associatedtype Node
    associatedtype Edge

    var nodes: [Node] { get }
    var edges: [Edge] { get }

    func neighbors(node: Node) -> [Edge]
}

// Different types could implement this in different ways. Unlike Java, the
// the value of each associated types is inferred; here, for example,
// Node is City and Edge is Road, even though we never explicitly say so:

struct City { }

struct Road {
    var length: Double
}

struct NavigationInfo: Graph {
    var nodes: [City]
    var edges: [Road]

    func neighbors(node: City) -> [Road] {
        fatalError("pretend this is implemented")
    }
}

// (Note that the fatalError() calls are just to make it compile without
// having to implement anything.)

// ------ Associated Types are not Generic Interfaces ------

// The inferred associated types is the first of the differences with Java,
// but not the biggest one.

// Suppose we allow some graphs to have edge weights:

protocol Weighted {
    associatedtype Weight: Numeric

    var weight: Weight { get }
}

// Note how much simplier the function signature of shortestPathWeight() is in Swift:

func shortestPathWeight<G>(on graph: G, from: G.Node, to: G.Node) -> G.Edge.Weight
        where G: Graph, G.Edge: Weighted {
    fatalError()
}

// What’s the difference? We only need _one_ generic type G. Because an associated type
// can only have ONE value for a given type. Given a Graph, it can only have one Node type
// and one Edge type. This means that given some type G that is a Graph, we can refer to
// “G’s Edge type.”
//
// Generic interfaces, on the other hand, allow _multiple_ conformances. In Java, if G is
// a Graph with weighted edges, we can’t say “G’s Edge type;” there could be many! For
// example, G could conform to both Graph<City,Road> and Graph<City,Airway>, and then its
// Edge types would be both Road and Airway.
//
// Note that shortestPathWeight() needs to return some Weight type -- but which one? There
// could be many. That’s why the type signature is so messy in Java: we have to say, “OK,
// first here are a bunch of generic types -- graph, node, edge, weight -- and here’s how
// they all have to fit together if you want to call this method.
//
// In Swift, we only need one generic type -- the graph -- and then we traverse its
// associated type relationships.

// ------ Conditional Extensions ------

// But wait! There's more! Instead of making shortestPathWeight() a free global function,
// we can ask Swift to make it magically appear as a member on any Graph if that graph has
// weighted edges:

extension Graph where Edge: Weighted {
    func shortestPathWeight(from: Node, to: Node) -> Edge.Weight {
        fatalError()
    }
}

// Hot dang! And we can do this retroacively with any type; here, for example, we can extend
// a type from the Swift standard library:

extension Sequence where Element: Numeric {
    func sumOfSquares() -> Element {
        var result: Element = 0
        for elem in self {
            result += elem * elem
        }
        return result
    }
}

[2, 3, 5].sumOfSquares()        // returns an Int
[2.5, 3.7, 5.9].sumOfSquares()  // returns a Double

// ["not", "numbers"].sumOfSquares()  // Compile error! String is not Numeric
