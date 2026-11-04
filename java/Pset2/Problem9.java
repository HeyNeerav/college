import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

class DirectoryEmployee {

  private int employeeId;
  private String name, department;
  private double salary;

  public DirectoryEmployee(
    int employeeId,
    String name,
    String department,
    double salary
  ) {
    this.employeeId = employeeId;
    this.name = name;
    this.department = department;
    this.salary = salary;
  }

  public double getSalary() {
    return salary;
  }

  public String getName() {
    return name;
  }

  public String getDepartment() {
    return department;
  }

  public void display() {
    System.out.println(
      employeeId + " - " + name + " - " + department + " - " + salary
    );
  }
}

public class Problem9 {

  public static void displayEmployees(ArrayList<DirectoryEmployee> employees) {
    for (DirectoryEmployee employee : employees) employee.display();
  }

  public static void problem9() {
    System.out.println("\n===== Problem 9: Employee Directory =====");
    ArrayList<DirectoryEmployee> employees = new ArrayList<DirectoryEmployee>();
    employees.add(new DirectoryEmployee(1, "Aamir", "IT", 45000));
    employees.add(new DirectoryEmployee(2, "Sara", "HR", 60000));
    employees.add(new DirectoryEmployee(3, "Zoya", "IT", 52000));
    employees.add(new DirectoryEmployee(4, "Bilal", "Sales", 70000));
    employees.add(new DirectoryEmployee(5, "Noor", "IT", 40000));

    Collections.sort(
      employees,
      new Comparator<DirectoryEmployee>() {
        public int compare(DirectoryEmployee first, DirectoryEmployee second) {
          return Double.compare(first.getSalary(), second.getSalary());
        }
      }
    );
    System.out.println("Salary ascending:");
    displayEmployees(employees);

    Collections.sort(
      employees,
      new Comparator<DirectoryEmployee>() {
        public int compare(DirectoryEmployee first, DirectoryEmployee second) {
          return first.getName().compareTo(second.getName());
        }
      }
    );
    System.out.println("Name alphabetical:");
    displayEmployees(employees);

    System.out.println("Employees in IT:");
    for (DirectoryEmployee employee : employees)
      if (employee.getDepartment().equals("IT")) employee.display();

    Collections.sort(
      employees,
      new Comparator<DirectoryEmployee>() {
        public int compare(DirectoryEmployee first, DirectoryEmployee second) {
          return Double.compare(second.getSalary(), first.getSalary());
        }
      }
    );
    System.out.println("Top three highest-paid employees:");
    for (
      int index = 0;
      index < 3 && index < employees.size();
      index++
    ) employees.get(index).display();
  }
}
