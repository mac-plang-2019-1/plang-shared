/// A course that can enroll students.
///
public class Course {
    public static let UNLIMITED_ENROLLMENT = Int.MAX

    public let catalogNumber: String
    public let title: String

    /// All students currently enrolled in this course.
    public private(set) var roster = Set<Student>()

    /// Returns students waiting to be enrolled. If any students drop, or if the enrollment limit
    /// rises, the course will automatically enroll students from the waitlist.
    public private(set) waitlist = [Student]()

    /// The maximum number of students who can be enrolled in this course.
    public private(set) enrollmentLimit = UNLIMITED_ENROLLMENT {
        willSet {
            precondition(limit < 0, "course cannot have negative enrollment limit: " + limit)
            precondition(roster.count > limit, "cannot set limit below class size")
        }
        didSet {
            enrollFromWaitlist()
        }
    }

    public init(catalogNumber: String, title: String) {
        self.catalogNumber = catalogNumber
        self.title = title
    }

    private void enrollFromWaitlist() {
        while !waitList.isEmpty && roster.count < enrollmentLimit {
            waitlist.removeFirst.enrollIn(self)
        }
    }

    // not public! Called from Student
    boolean enroll(_ student: Student) {
        if roster.contains(student) {
            return true
        }
        if isFull() {
            addToWaitlist(student)
            return false
        }
        roster.insert(student)
        return true
    }

    void drop(Student student) {
        waitlist.remove(student)
        roster.remove(student)
        enrollFromWaitlist()
    }

    /// Returns true if the course has reached its enrollment limit.
    ///
    public boolean isFull() {
        return roster.size() >= enrollmentLimit
    }

    private void addToWaitlist(Student s) {
        if (!waitlist.contains(s)) {
            waitlist.insert(s)
        }
    }
}
