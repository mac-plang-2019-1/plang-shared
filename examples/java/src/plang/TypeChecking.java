package plang;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class TypeChecking {
    public static void main(String[] args) {
        Duck fred = new Duck();
        fred.quack();
        Goose sally = new Goose();
        //sally.quack();   // ← Uncomment this and it will not compile. Java catches the type error at compile time.

        // Note that fred.quack() does not work if we declare fred as type Object,
        // even if the runtime value is still a duck:
        //
        //     Object fred = new Duck();
        //     fred.quack();   // Object has no quack() method

        // Note that:
        //
        // - We have to declare a Honkable type with a honk() method
        //   in order to be able to call it Goose and Car.
        //
        // - Goose and Car must _explicitly_ declare that they implement Honkable;
        //   it’s not enough that they just happen to have a honk() method.

        List<Honkable> things = Arrays.asList(new Goose(), new Car(), new Goose());
        for(Honkable thing: things)
            thing.honk();
    }
}

interface Honkable {
    void honk();
}

class Duck {
    public void quack() {
        System.out.println("quack!!");
    }
}

class Goose implements Honkable {
    public void honk() {
        System.out.println("HONK.");
    }
}

class Car implements Honkable {
    public void honk() {
        System.out.println("beep beep");
    }
}

