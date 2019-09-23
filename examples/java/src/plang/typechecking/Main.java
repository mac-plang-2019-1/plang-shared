package plang.typechecking;

import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Object> things = List.of(new Duck(), new Duck(), new Goose(), new Duck(), new Goose());
        for(Object thing : things) {
            if(thing instanceof Duck) {
                ((Duck) thing).quack();
            }
        }
    }
}
