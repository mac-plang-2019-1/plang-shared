import Foundation

// Extensions let us add new methods to existing types. Even from someone else’s library.
// Even to Swift’s own standard library classes!

extension String {
    public func removeFancyChars() -> String {
        return replacing(regex: "[^[:word:][:space:][:punct:]]", with: "")
    }
}

"🦄🦄🦄 Stay Artsy Minnesota! 🌈🌈🌈".removeFancyChars()

// In face, String.replacing(regex:with:) is itself an extension method I added to String,
// because the standard regex search is so clumsy:

extension String {
    func contains(regex: String) -> Bool {
        return range(of: regex, options: .regularExpression) != nil
    }

    func replacing(regex: String, with replacement: String) -> String {
        return replacingOccurrences(
            of: regex, with: replacement, options: .regularExpression, range: nil)
    }

    func replacing(regex: NSRegularExpression, with template: String) -> String {
        return regex.stringByReplacingMatches(in: self, options: [], range: fullRange, withTemplate: template)
    }

    fileprivate var fullRange: NSRange {
        return NSRange(location: 0, length: (self as NSString).length)
    }
}

// This looks a lot like Ruby’s monkey patching:

//    class String
//      def remove_fancy_chars
//        gsub(/[^[:word:][:space:][:punct:]]/, '').strip
//      end
//    end

// There’s a key difference, though: in Ruby, String has just one method named remove_fancy_chars,
// and _everyone_ shares it. Method lookup happens by name and name alone.
//
// In Swift, a new method added by an extension is semantically distinct from any other
// method, even one with the same name. And an extension can’t replace an existing method;
// it can only shadow it. So unlike Ruby, we can’t, for example, redefine integer addition
// for everyone! Whatever extension method code saw when it was compiled is still the one
// it will call at runtime. This makes Swift extensions like the one above much safer than
// Ruby’s monkey patching.


// Extensions can add not only new methods, but new protocol conformances.

// Here are two classes with no relationship:

class Goose {
}

class Car {
}

// But later — even in a separate module, we can create a new protocol and make existing
// classes conform to it:

protocol Honkable {
    func honk()
}

extension Goose: Honkable {
    func honk() {
        print("HAWNK")
    }
}

extension Car: Honkable {
    func honk() {
        print("beep beep")
    }
}

// ...even standard library types!

extension String: Honkable {
    func honk() {
        print("honk \(self) honk")
    }
}

// Now these types all have something in common:

var honkableThings0: [Honkable] = [Goose(), Car(), "hi class"]
for thing in honkableThings0 {
    thing.honk()
}

// We can even add an extension method _on the protocol itself_! This essentially means,
// “if something is honkable, then because it can honk, it can honkThrice. Here’s how.”

extension Honkable {
    func honkThrice() {
        honk()
        honk()
        honk()
    }
}

var honkableThings1: [Honkable] = [Goose(), Car(), "hi class"]
for thing in honkableThings1 {
    thing.honkThrice()
}

// But beware! It looks like we’re overriding honkThrice() for a subclass:

class HastyGoose: Goose {
}

extension HastyGoose {
    func honkThrice() {
        honk()
        print("whoosh")
        honk()
        print("whoosh")
        honk()
        print("whoosh")
    }
}

// ...but we’re not!

var honkableThings2: [Honkable] = [Goose(), HastyGoose(), Car(), "hi class"]
for thing in honkableThings2 {
    thing.honkThrice()  // never says "whoosh"
}

// Draw! Why wasn’t our HastyGoose implementation of honkThrice() called? It gets worse:

let goose: Goose = HastyGoose()
goose.honkThrice()  // still no "whoosh"

// ...and even:

(HastyGoose() as Goose).honkThrice()   // whooshless

// What’s going on? HastyGoose.honkThrice() does not _override_ Honkable.honkThrice();
// it _shadows_ it.
//
// Because honkThrice is introduce in an extension, the two implementations are
// semantically distinct methods. Extension methods do not have polymorphism;
// honkThrice() is statically dispatched, meaning that is uses the _static_ type of
// the receiver to determine what implementation to use.

// This is the price Swift pays for not having Ruby’s “monkey patch collision” problem.

// More scary details here: https://nomothetis.svbtle.com/the-ghost-of-swift-bugs-future

