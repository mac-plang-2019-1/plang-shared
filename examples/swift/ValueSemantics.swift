
class Person {
    var firstName: String
    var lastName: String

    init(firstName: String, lastName: String) {
        self.firstName = firstName
        self.lastName = lastName
    }

    var fullName: String {
        "\(firstName) \(lastName)"
    }
}

var p0 = Person(firstName: "Beyoncé", lastName: "Knowles")
var p1 = p0
p0.lastName = "Queen of the Universe"
p0.fullName
p1.fullName  // also says "Queen of the Universe, but wouldn't if Person were a struct



var l0 = ["one fish", "two fish", "red fish"]
var l1 = l0
l0.append("blue fish")
l0
l1  // does not have "blue fish" because Array has value semantics
