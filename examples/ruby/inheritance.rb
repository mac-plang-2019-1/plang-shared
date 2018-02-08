class AbstractList
    def append(element)
        add(size(), element)
    end
end

class ArrayList < AbstractList
    def initialize()
        @array = []
    end

    def add(position, element)
        # Ruby will grow the array automatically
        @array[position] = element
    end

    def size()
        @array.length  # or something
    end
end

students = ArrayList.new

#students.array           # No method called array, only ivar, so this is an error
#students.@array          # This isn’t legal either

# The key difference here is that in Ruby, ivars go in a separate
# object-owned hash table, and don't get resolved up the type chain.

students.size             # Ruby searches students, then ArrayList
students.append("sally")  # Ruby searches students, then ArrayList, then AbstractList
