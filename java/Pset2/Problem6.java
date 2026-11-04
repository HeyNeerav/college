import java.util.HashSet;

class WorkshopStudent {

  private int registrationNumber;
  private String name;

  public WorkshopStudent(int registrationNumber, String name) {
    this.registrationNumber = registrationNumber;
    this.name = name;
  }

  public boolean equals(Object object) {
    if (this == object) return true;
    if (object == null || getClass() != object.getClass()) return false;
    WorkshopStudent other = (WorkshopStudent) object;
    return registrationNumber == other.registrationNumber;
  }

  public int hashCode() {
    return registrationNumber;
  }

  public void display() {
    System.out.println(registrationNumber + " - " + name);
  }
}

public class Problem6 {

  public static void problem6() {
    System.out.println("\n===== Problem 6: Unique Workshop Students =====");
    HashSet<WorkshopStudent> registeredStudents =
      new HashSet<WorkshopStudent>();
    registeredStudents.add(new WorkshopStudent(101, "Aamir"));
    registeredStudents.add(new WorkshopStudent(101, "Aamir Khan"));
    registeredStudents.add(new WorkshopStudent(102, "Sara"));
    for (WorkshopStudent registeredStudent : registeredStudents)
      registeredStudent.display();
    System.out.println(
      "Registration 101 exists: " +
        registeredStudents.contains(new WorkshopStudent(101, "Any Name"))
    );
  }
}
