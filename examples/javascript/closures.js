// A wee helper function

let randomSample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

// This closure returns another closure. The inner closure captures
// both a parameter (suffixes) and a local variable (index) from the
// outer closure.

let makeEnthusiasmAppender3000 = (suffixes) => {
    let index = 0;
    return (s) => {
        index = (index + 1) % suffixes.length;
        return s + suffixes[index];
    };
};

// Each invocation of makeEnthusiasmAppender3000 creates a new set
// of captured variables — almost like instantiating an object
// with private instance variables named suffixes and index.
//
// Here, punctuationAppender3000 and emojiAppender3000 each maintain
// their own internal state via captured variables:

let punctuationAppender3000 = makeEnthusiasmAppender3000(["!", "?", "?!?"]);

let emojiAppender3000 = makeEnthusiasmAppender3000(["🤡", "😜🤩", "😳😀", "😰🤪", "💙💜", "🤩", "ឦ"]);

// Because punctuationAppender3000 and emojiAppender3000 both take
// a single string argument, we can use either of them as textTransform:

window.textTransform = punctuationAppender3000;
