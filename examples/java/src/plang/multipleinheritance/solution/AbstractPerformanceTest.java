package plang.multipleinheritance.solution;

public class AbstractPerformanceTest {

    // Composition instead of inheritance FTW!
    private Runnable action;

    void runPerformanceTest() {
        for(int iter = 0; iter < 10; iter++) {
            long timer = System.currentTimeMillis();

            for(int innerIter = 0; innerIter < 10000; innerIter++) {
                action.run();
            }

            System.out.println((System.currentTimeMillis() - timer) + "ms");
        }
    }
}
