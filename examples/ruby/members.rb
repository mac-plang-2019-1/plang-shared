class Bird
  def initialize(color)
    @color = color
  end

  def fly
    puts("flapflapflap and I am " + @color)
  end

  attr_accessor :color

  # Is sugar for:
  #
  # attr_accessor(:color)
  #
  # ...which generates:
  #
  # def color
  #   @color
  # end
  #
  # def color=(new_color)  # The actual method name is “color=” (wat?!)
  #   @color = new_color
  # end
end

class Duck < Bird
end

sally = Duck.new("various shades of brown")
sally.fly
sally.fly()  # Same thing! In Ruby, foo.bar is _always_ a method call
puts sally.color

# Note that we can’t get at another object’s instance variables.
# This is not legal syntax:
#
# sally.@color

# Class declarations are just code that runs from top to bottom.
# Let’s add 100 feather properties:

class Bird
  100.times { |n| attr_accessor("feather#{n}") }
end

sally.feather73 = "wingtip"
puts sally.feather73
