

class Duck:
    def quack(self):
        print("quack!")

class Goose:
    def honk(self):
        print("HONK.")

class Car:
    def honk(self):
        print("beep beep beep")

# This list of heterogenous objects works just fine,
# since they all happen to have a "honk method"

honkable_things = [Goose(), Car(), Car(), Goose(), Car()]

for thing in honkable_things:
    thing.honk()

# This compiles, but causes a runtime error:

Goose().quack()

# ...but notice that the code again ran _before_ the
# type error. It was a runtime error, not a compile-time error.
