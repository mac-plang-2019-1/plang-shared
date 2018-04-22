package plang;

import java.util.Collection;
import java.util.List;

// Here is a generic interface for things that have a Graph-like structure:

interface Graph<Node,Edge> {
    Collection<Node> getNodes();
    Collection<Edge> getEdges();
    Collection<Node> getNeighbors(Node n);
}

// And here is an interface that edges might implement if they are weighted:

interface Weighted<Weight extends Number> {
    Weight getWeight();
}

// Here is an example of a class implementing the graph interface. Note that NavigationInfo needs
// to explicitly say what Node and Edge types it uses to implement the Graph interface: the Nodes
// are Cities and the Roads are Edges:

class NavigationInfo implements Graph<City,Road> {
    @Override
    public Collection<City> getNodes() {
        throw new UnsupportedOperationException();
    }

    @Override
    public Collection<Road> getEdges() {
        throw new UnsupportedOperationException();
    }

    @Override
    public Collection<City> getNeighbors(City n) {
        throw new UnsupportedOperationException();
    }
}

class City { }

class Road implements Weighted<Double> {
    private double length;

    public double getLength() {
        return length;
    }

    @Override
    public Double getWeight() {
        return getLength();
    }
}

// Now suppose we want to implement a method that computes the weight of the shortest path between
// two nodes on a weighted graph. It needs to return the correct Weight type used by the Edge type
// of the Graph. And...

public class JavaHasNoAssociatedTypes {

    // ...here is what that looks like:

    static <Node, Weight extends Number, Edge extends Weighted<Weight>>
        Weight shortestPathWeight(Graph<Node,Edge> g, Node from, Node to) {

        throw new UnsupportedOperationException("pretend this is Dijkstra or whatever");
    }
}
