suits = ["clubs", "spades", "hearts", "diamonds"]

# for each of a bazillion cards
#   if card.suit == "spades"    # ← string comp is $$$
#     do the spadey thing

class Suit
  # stuff in here to give it a name
end


clubs = Suit.new("clubs")
spades = Suit.new("spades")
hearts = Suit.new("hearts")
diamonds = Suit.new("diamonds")
suits = [
  clubs,
  spades,
  hearts,
  diamonds,
]

# for each of a bazillion cards
#   if card.suit == spades    # ← obj identity comparison is cheap
#     do the spadey thing

# for each of a bazillion cards
#   if card.suit == Suit.new("spades")    # oops!
#     do the spadey thing

suits = [:hearts, :spades, :diamonds, :clubs]

# for each of a bazillion cards
#   if card.suit == :spades    # FAST
#     do the spadey thing
