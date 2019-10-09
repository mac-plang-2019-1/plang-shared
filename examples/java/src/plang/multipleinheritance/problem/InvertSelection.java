package plang.multipleinheritance.problem;

public class InvertSelection extends UndoableAction {

    protected void reallyDoAction() {
        // do lots of pixel stuff
    }

    protected void reallyUndoAction() {
        // undo lots of pixel stuff
    }
}

class InvertSelectionPerformanceTest implements Runnable {
    @Override
    public void run() {
        new InvertSelection().reallyDoAction();
    }
}