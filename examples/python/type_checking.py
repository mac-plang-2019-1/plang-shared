

class Duck:
    def quack(self):
        print("quack!")

    def swim(self):
        print("paddle paddle sploosh splash")
        pass

class Goose:
    def honk(self):
        print("HONK.")

    def swim(self):
        print("<angry> SWIM. SWIM.")
        pass

class Car:
    def honk(self):
        print("beep beep beep")

# This list of heterogenous objects works just fine,
# since they all happen to have a "honk method"

things = [Goose(), Car(), Duck(), Car(), Goose(), Duck(), Goose(), Car()]
for thing in things:
    try:
        thing.honk()
    except AttributeError:
        pass

for thing in things:
    if hasattr(thing, 'swim'):
        thing.swim()
