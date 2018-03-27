import Foundation

/**
 * A Python class.
 */
public class PythonType: PythonObject {

    private let name: String
    private let base: PythonObject?

    /**
     * Declares a new Python type. Equivalent to Python `class «name»(«base»):`
     * @param name The name of this class.
     * @param base The base class of this class. May be null.
     *             (In real Python, instead of null it would be the class called `object`, and
     *             it would be a list instead of a single value.)
     */
    public init(_ name: String, _ base: PythonObject?) {
        self.name = name
        self.base = base
        super.init(nil)  // In real Python, this would be the type called `type`
    }

    /**
     * The name of this class.
     */
    public func getName() -> String {
        return name
    }

    /**
     * The base type (superclass) of this class.
     */
    public func getBase() -> PythonObject? {
        return base
    }

    internal override func buildMRO() -> [PythonObject] {
        var result = [PythonObject]()
        result.append(self)
        if let mro = base?.getMRO() {
            result.append(contentsOf: mro)
        }
        return result
    }

    /**
     * Creates and returns a new instance of this class, i.e. a PythonObject whose type is
     * this PythonType.
     */
    public func instantiate() -> PythonObject {
        return PythonObject(self)
    }

    public override var description: String {
        return "PythonType<" + name + ">";
    }
}

