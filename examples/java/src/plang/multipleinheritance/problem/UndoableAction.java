package plang.multipleinheritance.problem;

public abstract class UndoableAction {
    private boolean done = false;

    public void doAction() {
        if (done) {
            return;
        }
        done = true;
        reallyDoAction();
    }

    protected abstract void reallyDoAction();

    public void undoAction() {
        if (!done) {
            return;
        }
        done = false;
        reallyUndoAction();
    }

    protected abstract void reallyUndoAction();
}
