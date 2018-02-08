class AbstractList:
    def append(self, element):
        self.add(self.size(), element)

class ArrayList(AbstractList):
    def __init__(self):
        self.array = []

    def add(self, position, element):
        if position == self.size():  # Increase array size if needed
            self.array.append(None)
        self.array[position] = element

    def size(self):
        return len(self.array)

students = ArrayList()
students.array            # Python searches students
students.size()           # Python searches students, then ArrayList
students.append("sally")  # Python searches students, then ArrayList, then AbstractList
