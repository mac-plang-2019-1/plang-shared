import Foundation


var strings: [String]  // sugar for Array<String>

// var stringMaybe: Optional<String> = Optional.some("hello")
var stringMaybe: String? = "hello"

// We can add new methods to existing types:

extension Array {
    func yellAll() {
        for e in self {
            print("\(e)!!!!!!!")
        }
    }
}

[1, 3, 7].yellAll()
["hi", "bye"].yellAll()

//---------------------------------------

protocol Uppercasable {
    func uppercased() -> String
}

// Retroactive modeling: we can make existing types
// conform to new protocols! Wild!

var numberNames = [0: "zero", 1: "one", 2: "two", 3: "three", 4: "four"]

extension Int: Uppercasable {
    func uppercased() -> String {
        numberNames[self]?.uppercased() ?? "THE NUMBER \(self)"
    }
}

3.uppercased()
12.uppercased()

extension String: Uppercasable {
    // String already has this method, so nothing to do!
    // But we still have to explicitly add the conformance.
}

// We can _conditionally_ add a method to a generic type if the type
// parameters satisfy a condition. Here yellAllLoudly() appears on
// an array only if its elements are Uppercasable:

extension Array where Element: Uppercasable {
    func yellAllLoudly() {
        for e in self {
            print("\(e.uppercased())!!!!!!!")
        }
    }
}

// Now yellAllLoudly() is available for Arrays of Strings and Ints:

["hi", "bye"].yellAllLoudly()
[1, 3, 7].yellAllLoudly()

// And we can even make Array conditionally conform to a protocol:

extension Array: Uppercasable where Element: Uppercasable {
    func uppercased() -> String {
        map { elem in elem.uppercased() }
            .joined(separator: " ")
    }
}

// Now not only does the uppercased() method appear for an array
// of Uppercasable elements...

["hi", "bye"].uppercased()

// ...but that array itself is uppercasable, so this works:

[["hi", "bye"], ["hither", "thither"]].uppercased()

// ...but that array itself is Uppercasable, so this works:

[["hi", "bye"], ["hither", "thither"]].yellAllLoudly()

// And that last conditional conformance can even recursively apply to itself!
// Here is an array of arrays of arrays of Uppercasables, which is itself
// automatically Uppercasable:

[[[1]], [[2, 3], [4, 5, 6]]].yellAllLoudly()

