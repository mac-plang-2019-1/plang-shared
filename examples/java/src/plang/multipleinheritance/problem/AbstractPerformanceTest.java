package plang.multipleinheritance.problem;

public abstract class AbstractPerformanceTest {

    void runPerformanceTest() {
        for(int iter = 0; iter < 10; iter++) {
            long timer = System.currentTimeMillis();

            for(int innerIter = 0; innerIter < 10000; innerIter++) {
                doAction();
            }

            System.out.println((System.currentTimeMillis() - timer) + "ms");
        }
    }

    protected abstract void doAction();
}
