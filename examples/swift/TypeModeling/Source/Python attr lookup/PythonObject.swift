import Foundation

/**
 * The runtime state of an object in Python.
 */
public class PythonObject: Equatable, CustomStringConvertible {
    private var attrs = [String:PythonObject?]()

    public init(_ type: PythonType?) {
        self.type = type
    }

    /**
     * The Python type (i.e. class) of this object.
     *
     * May be null if this object is itself a class. This is a simplification for this assignment;
     * in actual Python, _all_ objects have types, and the type of a class is `type`. That is itself
     * a class, so the type of `type` is `type`. Phew! Thank goodness we’re ignoring that.
     */
    public let type: PythonType?

    /**
     * Return the list of objects we should search when asked for a given attribute, in the order
     * we should search them.
     *
     * The real Python implementation of the MRO is substantially more complicated, because
     * (1) Python supports multiple inheritance (i.e. classes can have multiple base classes), and
     * (2) the base of `type` is `object`, and the type of `object` is `type`, which creates a
     *     circular reference that Python resolves by special-casing both `object` and `type`.
     *
     * Once again, hooray for not having to deal with that.
     */
    public lazy var mro: [PythonObject] = buildMRO()
    //                                    ⬆︎
    // Note that we don’t need Collections.unmodifiableList() as we do in Java:
    // copy on write prevents others from modifying our MRO.

    /**
     * Constructs the MRO. Called only once, the first time we need the MRO; this class memoizes the
     * result (i.e. mro remembers the list buildMRO() returned and keeps returning it).
     */
    internal func buildMRO() -> [PythonObject] {
        return [self] + (type?.mro ?? [])
    }

    /**
     * Returns the value of the attribute with the given name for this object.
     *
     * @param attrName The name of the attribute to look for.
     * @return Its value if found.
     * @throws PythonAttributeException When there is no attribute on this object with that name.
     */
    public final func get(_ attrName: String) throws -> PythonObject? {
        for obj in mro {
            if let value = obj.attrs[attrName] {
                return value
            }
        }

        throw PythonAttributeException(object: self, attrName: attrName)
    }

    /**
     * Add or changes the value of an attribute on this object. Note that it sets the value for
     * _this_ object alone, even if the attribute already exists somewhere upstream in the attribute
     * resolution order.
     *
     * @param attrName The name of the attribute to set
     * @param value Its new value
     */
    public final func set(_ attrName: String, _ value: PythonObject?) {
        attrs[attrName] = value
    }

    public var description: String {
        return "PythonObject<\(type?.name ?? "<no type>")>\(attrs)"
    }

    public static func == (_ lhs: PythonObject, _ rhs: PythonObject) -> Bool {
        return lhs === rhs
    }
}

public struct PythonAttributeException: Error, CustomStringConvertible {
    public let object: PythonObject
    public let attrName: String

    public var description: String {
        return "AttributeError: '"
            + (object.type?.name ?? "<untyped>")
            + "' object has no attribute '"
            + attrName
            + "'"
    }
}

