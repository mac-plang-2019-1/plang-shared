types = ["String", "Integer", "SimpleList_String"]


types.each do |type|
  puts "

    class SimpleList_#{type} {
        private #{type}[] items = new #{type}[16];
        private int count = 0;

        public void add(#{type} item) {
            items[count++] = item;
        }

        public #{type} get(int i) {
            return items[i];
        }
        
        public int getSize() {
            return count;
        }
    }

  "
end
