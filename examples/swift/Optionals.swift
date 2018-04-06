import Cocoa

struct Person {
    var firstName: String
    var middleName: String?
    var lastName: String

    var fullName: String {
        if let middleName = middleName {
            return firstName + " " + middleName + " " + lastName
        } else {
            return firstName + " " + lastName
        }
    }
}

let beyoncé = Person(
    firstName: "Beyoncé",
    middleName: "Giselle",
    lastName: "Knowles, Esq.")

let sally = Person(
    firstName: "Sally",
    middleName: nil,
    lastName: "Jones")

// Clumsy:
/*
func middleNameLength(of person: Person?) -> Int {
    if let person = person {
        if let middleName = person.middleName {
            return middleName.count
        }
    }
    return 0
}
*/

// Better:
/*
func middleNameLength(of person: Person?) -> Int {
    if let person = person, let middleName = person.middleName {
        return middleName.count
    } else {
        return 0
    }
}
*/

// Best! optional chaining + nil coalescing FTW

func middleNameLength(of person: Person?) -> Int {
    return person?.middleName?.count ?? 0
}

middleNameLength(of: beyoncé)
middleNameLength(of: sally)
middleNameLength(of: nil)
