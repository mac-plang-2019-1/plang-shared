class Bird:
    def __init__(self, color):
        self.color = color

    def fly(self):
        print("flapflapflap")

class Duck(Bird):
    pass

penguin = Bird("black and white")
parrot = Bird("green etc.")
sally = Duck("various shades of brown")

print(sally.color)

# We can just add new members, because we're
# really just putting a new value in the dictionary:

sally.favorite_ice_cream = "snail flavor"  # she’s a duck
print(sally.favorite_ice_cream)

# Methods are just property accesses too:

sally_fly_method = sally.fly
sally_fly_method()
