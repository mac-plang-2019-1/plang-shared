// a simple closure

var inc = (x) => {
    return x + 1;
}
inc(3)

// no braces = shortcut for evaluating a single expression & returning result

var inc = (x) => x + 1;
inc(3)

// functions can accept other functions

function thrice(f) {
    f()
    f()
    f()
}

thrice(() => console.log("hi"))

// These two do the same thing

(arriving ? sayHi() : sayBye())
(arriving ? sayHi : sayBye)()

// Functions can return functions

function sayHiTo(name) {
    console.log("Hi, " + name + "!")
}

thrice(sayHiTo("Sally"))  // doesn't work; why?

function makeSayHiToFunction(name) {
    return () => { sayHiTo(name) }  // lexical capture of name
}

thrice(makeSayHiToFunction("Sally"))  // this works

thrice(() => sayHiTo("Sally"))  // could also do it on the spot
