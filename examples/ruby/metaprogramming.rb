
# Here is our duck/goose example in Ruby:

class Duck
  def quack
    puts "quack."
  end

  def swim
    puts "paddle paddle"
  end
end

class Goose
  def honk
    puts "HONK."
  end

  def swim
    puts "<graceful gliding>"
  end
end

things = [Duck.new, Duck.new, Goose.new]
things.each do |thing|
  thing.swim            # works
end
things.each do |thing|
  thing.quack           # runs, then errors on the third
end

# –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# Looks similar! But … in Ruby, a class declaration is just code that runs from
# top to bottom. We can run code _in the middle of declaring the class_:

class Duck
  puts "Hi! I am declaring Duck now."

  def quack
    puts "quack."
  end

  puts "There goes quack! About to add the swim method...."

  def swim
    puts "paddle paddle"
  end

  puts "All done!"
end

# –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# This means that we can use code to control a class definition:

puts "Do you want Ducks to be able to swim?"
SWIMMING_ENABLED = (STDIN.readline.strip.downcase == 'y')

class Duck
  def quack
    puts "quack."
  end

  if SWIMMING_ENABLED  # Here a conditional alters class structure at runtime
    def swim
      puts "paddle paddle"
    end
  end
end

# –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# This is called "metaprogramming." We can use it to automate repetitive code
# structure. For example, here we want duck to have a "quack" method and goose
# to have a "honk" method, but also both to have a "vocalize" method that does
# the same thing. We can automate that:

class AquaticAnimal

  # “def self.foo” means “define foo on the class itself. Ruby has a rule that
  # while you are declaring a class, the superclass’s methods are in scope.
  # This thus makes a swimming_sound method available when declaring subclasses
  # of AquaticAnimal.
  #
  def self.swimming_sound(sound)
    define_method('swim') do
      puts sound
    end
  end

  # One metaprogramming method declares _two_ methods on the calling class:
  #
  def self.vocalization(sound_name, sound_message)
    define_method(sound_name) do
      puts sound_message
    end

    define_method('vocalize') do
      puts sound_message
    end
  end

  # Or we could do that with a loop:
  #
  def self.vocalization(sound_name, sound_message)
    [sound_name, 'vocalize'].each do |method_name|
      define_method(method_name) do
        puts sound_message
      end
    end
  end
end

class Duck < AquaticAnimal
  vocalization 'quack', "quack."
  swimming_sound "paddle paddle"
end

class Goose < AquaticAnimal
  vocalization 'honk', "HONK."
  swimming_sound "<graceful gliding>"
end

things = [Duck.new, Duck.new, Goose.new]
things.each do |thing|
  thing.swim
  thing.vocalize
end

# –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# It’s even possible to alter a class _after_ it's declared! Yikes!
# This is called "reopening a class."

d = Duck.new
d.quack

class Duck
  def quack
    puts "oogity boogity"
  end
end

d.quack

# –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# EVERY value is an object. Even integers.
#
# We can ask an integer what its class is:

1.class  # → Integer

# And EVERY action in Ruby is a method. Even addition! This:

1 + 2

# …is just syntactic sugar for calling the "+" method on 1:

1.+(2)

# Reopening classes works on classes you didn't write. Double yikes! This is
# called “monkey patching:”

class Integer
  def wonkle(other)
    self * 7 - other * 3
  end
end

35.wonkle(2)

# We can even change what addition means:

class Integer
  def +(value)
    wonkle(value)
  end
end

# –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# Why on earth would you want this?!??
#
# Well, Ruby programmers are not usually so reckless with metaprogramming. They
# use it to write frameworks in which purpose-specific methods are right at
# hand, and make code that is low on repetition and high on communicating intent.
#
# Here is a snippet from a real-world app:

class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_filter :require_user

  def require_user(notice = 'You need to log in first.')
    store_location
    if !current_user
      flash[:notice] = notice
      redirect_to log_in_path
    else
      if current_user.pending? && request.path != subscription_payments_path
        flash[:notice] = 'You need to finish signup before you continue.'
        redirect_to subscription_payments_path
      elsif current_user.paid? && request.path != dashboard_path
        redirect_to dashboard_path, notice: "Your membership needs to be verified before you can access that area."
      end
    end
  end
end

# Consider this line:

redirect_to log_in_path

# Here “log_in_path” exists because a configuration file said that there is an
# API endpoint called “log_in”, and so Ruby on Rails generated a log_in_path
# method for us.
#
# Think about what that might look like in a hypothetical Java world:

return new ResponseBuilder().createRedirect(
  applicationContext.getPath(ApplicationRoutes.LOG_IN))

# This is made-up code, but it captures at least the spirit of Java if not any
# specific individual web framework. Java works to make building blocks visible.
# Ruby isn’t concerned with that; it’s worried about making code fluent and
# readable.
#
# Both languages try to reduce programmer error by using _something_ as a proxy
# for complex semantics.
#
# Java uses names and types as a proxy for semantics.
# It strives to make _structure_ clear.
#
# Ruby uses metaprogramming and fluent readability as a proxy for semantics.
# It strives to make _intent_ clear.
