/// A student at a school.
///
public class Student {
    public let name: String

    /// All courses this student is currently enrolled in.
    public private(set) var courses = Set<Course>()

    public init(name: String) {
        self.name = name  // String can’t be null, so no null check
    }

    /// Add this student to the given course's roster.
    /// Has no effect if the student is already registered.
    ///
    public enroll(in course: Course) -> Bool {
        let success = course.enroll(this)
        if success {
            courses.add(course)
        }
        return success
    }

    /// Drops this student from the given course, or removes them from the wait list.
    /// Has no effect if student is not already enrolled or waitlisted.
    ///
    public drop(_ course: Course) {
        courses.remove(course)
        course.drop(this)
    }
}
