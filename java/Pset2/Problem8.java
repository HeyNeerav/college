import java.util.ArrayList;
import java.util.HashMap;

class Course {

  private String courseCode, courseName;
  private int capacity;

  public Course(String courseCode, String courseName, int capacity) {
    this.courseCode = courseCode;
    this.courseName = courseName;
    this.capacity = capacity;
  }

  public String getCourseCode() {
    return courseCode;
  }

  public int getCapacity() {
    return capacity;
  }

  public void display() {
    System.out.println(
      courseCode + " - " + courseName + " (Capacity: " + capacity + ")"
    );
  }
}

class CourseStudent {

  private String studentId, name;

  public CourseStudent(String studentId, String name) {
    this.studentId = studentId;
    this.name = name;
  }

  public String getStudentId() {
    return studentId;
  }

  public void display() {
    System.out.println(studentId + " - " + name);
  }
}

public class Problem8 {

  public static void addCourse(
    HashMap<String, Course> courses,
    HashMap<String, ArrayList<CourseStudent>> registrations,
    Course course
  ) {
    if (courses.containsKey(course.getCourseCode())) {
      System.out.println("Course already exists.");
      return;
    }
    courses.put(course.getCourseCode(), course);
    registrations.put(course.getCourseCode(), new ArrayList<CourseStudent>());
  }

  public static void registerStudent(
    HashMap<String, Course> courses,
    HashMap<String, ArrayList<CourseStudent>> registrations,
    String courseCode,
    CourseStudent student
  ) {
    Course course = courses.get(courseCode);
    if (course == null) {
      System.out.println("Course not found.");
      return;
    }

    ArrayList<CourseStudent> students = registrations.get(courseCode);
    for (CourseStudent registeredStudent : students) {
      if (registeredStudent.getStudentId().equals(student.getStudentId())) {
        System.out.println("Student already registered in this course.");
        return;
      }
    }

    if (students.size() >= course.getCapacity()) {
      System.out.println("Course is full.");
      return;
    }
    students.add(student);
  }

  public static void displayCourseStudents(
    HashMap<String, Course> courses,
    HashMap<String, ArrayList<CourseStudent>> registrations,
    String courseCode
  ) {
    Course course = courses.get(courseCode);
    if (course == null) {
      System.out.println("Course not found.");
      return;
    }
    course.display();
    for (CourseStudent student : registrations.get(courseCode))
      student.display();
  }

  public static void problem8() {
    System.out.println("\n===== Problem 8: Course Registration =====");
    HashMap<String, Course> courses = new HashMap<String, Course>();
    HashMap<String, ArrayList<CourseStudent>> registrations = new HashMap<
      String,
      ArrayList<CourseStudent>
    >();
    addCourse(courses, registrations, new Course("CS101", "Java", 2));
    addCourse(courses, registrations, new Course("CS102", "Database", 3));
    registerStudent(
      courses,
      registrations,
      "CS101",
      new CourseStudent("S1", "Aamir")
    );
    registerStudent(
      courses,
      registrations,
      "CS101",
      new CourseStudent("S2", "Sara")
    );
    registerStudent(
      courses,
      registrations,
      "CS101",
      new CourseStudent("S1", "Aamir")
    );
    registerStudent(
      courses,
      registrations,
      "CS101",
      new CourseStudent("S3", "Zoya")
    );
    displayCourseStudents(courses, registrations, "CS101");
  }
}
