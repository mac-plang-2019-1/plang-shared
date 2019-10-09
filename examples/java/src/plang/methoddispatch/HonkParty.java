package plang.methoddispatch;

import java.util.List;

public class HonkParty {
    public static void main(String[] args) {
        List<Honkable> honkingThings = List.of(
            new Goose(),
            new Car(),
            new Roadrunner(),
            new Goose());

        for (Honkable thing : honkingThings) {
            thing.honk();
        }
    }
}
