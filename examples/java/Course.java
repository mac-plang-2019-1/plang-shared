package registrar;

import java.util.*;

/**
 * A course that can enroll students.
 */
public class Course {
    public static final int UNLIMITED_ENROLLMENT = Integer.MAX_VALUE;

    private final String catalogNumber;
    private final String title;
    private Set<Student> roster = new HashSet<>();
    private List<Student> waitlist = new ArrayList<>();
    private int enrollmentLimit = UNLIMITED_ENROLLMENT;

    public Course(String catalogNumber, String title) {
        this.catalogNumber = Objects.requireNonNull(catalogNumber, "catalogNumber");
        this.title = Objects.requireNonNull(title, "title");
    }

    public String getCatalogNumber() {
        return catalogNumber;
    }

    public String getTitle() {
        return title;
    }

    /**
     * The maximum number of students who can be enrolled in this course.
     */
    public int getEnrollmentLimit() {
        return enrollmentLimit;
    }

    public void setEnrollmentLimit(int limit) {
        if (limit < 0) {
            throw new IllegalArgumentException("course cannot have negative enrollment limit: " + limit);
        }
        if (getRoster().size() > limit) {
            throw new IllegalArgumentException("cannot set limit below class size");
        }

        this.enrollmentLimit = limit;

        enrollFromWaitlist();
    }

    private void enrollFromWaitlist() {
        while (!getWaitList().isEmpty() && getRoster().size() < enrollmentLimit) {
            waitlist.remove(0).enrollIn(this);
        }
    }

    /**
     * Returns all students currently enrolled in this course.
     */
    public Set<Student> getRoster() {
        return Collections.unmodifiableSet(roster);
    }

    /**
     * Returns students waiting to be enrolled. If any students drop, or if the enrollment limit
     * rises, the course will automatically enroll students from the waitlist.
     */
    public List<Student> getWaitList() {
        return Collections.unmodifiableList(waitlist);
    }

    boolean enroll(Student student) {
        if (roster.contains(student)) {
            return true;
        }
        if (isFull()) {
            addToWaitlist(student);
            return false;
        }
        roster.add(student);
        return true;
    }

    void drop(Student student) {
        waitlist.remove(student);
        roster.remove(student);
        enrollFromWaitlist();
    }

    /**
     * Returns true if the course has reached its enrollment limit.
     */
    public boolean isFull() {
        return roster.size() >= enrollmentLimit;
    }

    private void addToWaitlist(Student s) {
        if (!waitlist.contains(s)) {
            waitlist.add(s);
        }
    }

    @Override
    public String toString() {
        return getTitle() + " (" + getCatalogNumber() + ")";
    }
}
