import Foundation

struct Name {
    var first: String
    var last: String {
        didSet {
            print("Last name changed: \(oldValue) → \(last)")
        }
    }
}

struct Student {
    var name: Name {
       didSet {
           print("Student name changed: \(oldValue) → \(name)")
       }
    }
    var year: Int
}

struct Course {
    var roster: [Student] {
      didSet {
          print("Roster changed: \(oldValue) → \(roster)")
      }
    }
}

var sally = Student(name: Name(first: "Sally", last: "Jones"), year: 3)
var comp394 = Course(roster: [
    Student(name: Name(first: "Fred", last: "Smith"), year: 1),
    sally,
    Student(name: Name(first: "Wilma", last: "Rajagopalchari"), year: 4)
])

//comp394.roster[1].name.last = "The Conqueror"

comp394.roster[1].name.last.append("!")

print(sally)

comp394.roster[1].name.last



