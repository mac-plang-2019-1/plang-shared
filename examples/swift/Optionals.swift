import Foundation


extension Int {
    func wongle() -> Int {
        return self * 10 - 3
    }
}

352.wongle()



func wonglePrime(_ x: Int) -> Int {
    return x * 10 - 3
}

wonglePrime(352)



extension Array {
    var countExaggerated: Int {
        return count * 10
    }
}

extension Array where Element == Int {
    var sum: Int {
        var result = 0
        for i in self {
            result += i
        }
        return result
    }
}

[3, 4, 2].countExaggerated
[3, 4, 2].sum
["hi", "bye"].sum





//class Animal {
//    func makeNoise() -> String {
//        return "I don’t know what I am!"
//    }
//}
//func makeNoiseAnimalIsParam(_ animal: Animal) -> String {
//    return "I don’t know what I am!"
//}
//
//class Duck: Animal {
//    override func makeNoise() -> String {
//        return "quack"
//    }
//}
//func makeNoiseAnimalIsParam(_ animal: Duck) -> String {
//    return "quack"
//}
//
//
//class Goose: Animal {
//    override func makeNoise() -> String {
//        return "honk"
//    }
//}
//func makeNoiseAnimalIsParam(_ animal: Goose) -> String {
//    return "honk"
//}
//
//
//var d: Animal = Duck()
//d.makeNoise()
//makeNoiseAnimalIsParam(d)
//d = Goose()
//d.makeNoise()
//makeNoiseAnimalIsParam(d)



