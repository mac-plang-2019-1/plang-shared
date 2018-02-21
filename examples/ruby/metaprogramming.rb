# We’ll create a new metaprogramming construct called observable_property
# that we can use in any class declaration.

class Class
  def observable_property(property_name)
    value = nil     # These local variables are captured by all the block below.
    observers = []  # Because they are local, we get new ones for each property.

    # Getter

    define_method(property_name) do
      value
    end

    # Setter

    define_method("#{property_name}=") do |new_value|
      old_value = value
      value = new_value

      observers.each do |observer|
        observer.call(old_value, new_value)
      end
    end

    # Add observer

    define_method("add_#{property_name}_observer") do |&observer|
      observers << observer
    end
  end
end


# Now we'll declare a class that uses our metaprogramming construct.

class Person
  observable_property :name
  observable_property :shoe_size
end


# Let's try it out!

sally = Person.new

sally.add_name_observer do |old_name, new_name|
  puts "Name changed: #{old_name} → #{new_name}"
end
sally.add_shoe_size_observer do |old_size, new_size|
  puts "Shoe size changed: #{old_size} → #{new_size}"
end

sally.name = "Sally"
sally.shoe_size = 17
sally.shoe_size = 17.5

sally.add_shoe_size_observer do |new_size|
  puts "Yikes!! What’s in that multivitamin she’s taking?!? 😳"
end

sally.shoe_size = 18
sally.shoe_size = 18.5

# She becomes a pro wrestler
sally.name = "Sally the Giant"

puts "Final results:"
puts sally.name
puts sally.shoe_size
