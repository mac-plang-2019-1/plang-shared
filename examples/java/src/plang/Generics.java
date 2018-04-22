package plang;

import java.util.List;

import javax.swing.JFrame;

public class Generics {
    public static void main(String[] args) {

        SimpleList_String names = new SimpleList_String();
        names.add("Sally");
        names.add("Horatio");
        names.add("Spliterator Q. Thole");
        greet(names.get(2));

        SimpleList_Integer heights = new SimpleList_Integer();
        heights.add(17);
        heights.add(3);
        heights.add(25);
        reachTo(heights.get(2));

        printAll_String(names);
        printAll_Integer(heights);

        SimpleList_SimpleList_String nameLists = new SimpleList_SimpleList_String();
        nameLists.add(names);
        nameLists.add(names);
    }

    public static void greet(String name) {
        System.out.println("Hello, " + name);
    }

    public static void reachTo(int height) {
        System.out.println("Reaching up to " + height + " meters");
    }

    public static void printAll_String(SimpleList_String items) {
        for(int n = 0; n < items.getSize(); n++) {
            System.out.println(items.get(n));
        }
    }

    public static void printAll_Integer(SimpleList_Integer items) {
        for(int n = 0; n < items.getSize(); n++) {
            System.out.println(items.get(n));
        }
    }
}

class SimpleList_String {
    private String[] items = new String[16];
    private int count = 0;

    public void add(String item) {
        items[count++] = item;
    }

    public String get(int i) {
        return items[i];
    }

    public int getSize() {
        return count;
    }
}

class SimpleList_Integer {
    private Integer[] items = new Integer[16];
    private int count = 0;

    public void add(Integer item) {
        items[count++] = item;
    }

    public Integer get(int i) {
        return items[i];
    }

    public int getSize() {
        return count;
    }
}

class SimpleList_SimpleList_String {
    private SimpleList_String[] items = new SimpleList_String[16];
    private int count = 0;

    public void add(SimpleList_String item) {
        items[count++] = item;
    }

    public SimpleList_String get(int i) {
        return items[i];
    }

    public int getSize() {
        return count;
    }
}
