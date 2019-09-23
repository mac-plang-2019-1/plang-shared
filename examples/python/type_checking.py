class Duck:
    def quack(self):
        print("quack!")

    def swim(self):
        print("paddle paddle")

class Goose:
    def honk(self):
        print("HONK.")

    def swim(self):
        print("<graceful gliding>")

things = [Duck(), Duck(), Goose(), Duck(), Goose()]

for thing in things:
    if hasattr(thing, "quack"):
        thing.quack()
