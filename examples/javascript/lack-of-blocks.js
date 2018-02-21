
// Compare this example to ../ruby/blocks.rb

function firstGreaterThanMax(max, array) {
  array.forEach((x) => {
    if(x > max) {
      return x;   // Does not work! We can only return from the closure, not the containing function
    }
  });
  return null;  // firstGreaterThanMax() _always_ reaches this line
}

firstGreaterThanMax(50, [3, 4, 7, 11, 18, 29, 47, 76, 123, 199, 322])
