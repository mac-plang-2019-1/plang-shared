package plang;

import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.List;

public class TypeChecking {
    public static void main(String[] args) {
        Goose sally = new Goose();
        //sally.quack();   // ← Uncomment this and it will not compile. Java catches the type error at compile time.

        // Note that fred.quack() does not work if we declare fred as type Object,
        // even if the runtime value is still a duck:
        //
        //     Object fred = new Duck();
        //     fred.quack();   // Object has no quack() method

        // Note that:
        //
        // - We have to declare a AlertEmitting type with a honk() method
        //   in order to be able to call it Goose and Car.
        //
        // - Goose and Car must _explicitly_ declare that they implement AlertEmitting;
        //   it’s not enough that they just happen to have a honk() method.

        List<Object> things = Arrays.asList(new Goose(), new Car(), new Duck(), new Goose(), "none of the above");

        System.out.println("------ honks/quacks using interface ––––––");
        for(Object thing: things)
            if(thing instanceof AlertEmitting)
                ((AlertEmitting) thing).emitAlert();

        System.out.println("------ swimming using interface ––––––");
        for(Object thing: things)
            if(thing instanceof Aquatic)
                ((Aquatic) thing).swim();

        // This silly dance is called "reflection."
        // Java makes it hard by design. Python makes it easy by design.

        System.out.println("------ honks using reflection ––––––");
        for(Object thing: things) {
            try {
                thing.getClass().getMethod("honk").invoke(thing);
            } catch(NoSuchMethodException e) {
                // skip
            } catch(IllegalAccessException | InvocationTargetException e) {
                // um ... what are we even supposed to do here?
            }
        }

    }
}

interface AlertEmitting {
    void emitAlert();
}

interface Aquatic {
    void swim();
}

class Duck implements Aquatic, AlertEmitting {
    public void quack() {
        System.out.println("quack!!");
    }

    public void swim() {
        System.out.println("happy swim");
    }

    @Override
    public void emitAlert() {
        quack();
    }
}

class Goose implements AlertEmitting, Aquatic {
    public void honk() {
        System.out.println("HONK.");
    }

    public void swim() {
        System.out.println("ANGRY SWIM.");
    }

    @Override
    public void emitAlert() {
        honk();
    }
}

class Car implements AlertEmitting {
    public void honk() {
        System.out.println("beep beep");
    }

    @Override
    public void emitAlert() {
        honk();
    }
}

