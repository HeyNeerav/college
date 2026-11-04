class Employee {

  private int employeeId;
  private String name;
  private double basicSalary;

  public Employee(int employeeId, String name, double basicSalary) {
    this.employeeId = employeeId;
    this.name = name;
    this.basicSalary = basicSalary;
  }

  public double getGrossSalary() {
    double hra = basicSalary * 0.20;
    double da = basicSalary * 0.10;
    double bonus = 0;
    if (basicSalary > 50000) bonus = basicSalary * 0.05;
    return basicSalary + hra + da + bonus;
  }

  public String getName() {
    return name;
  }

  public void display() {
    System.out.println(
      "ID: " +
        employeeId +
        ", Name: " +
        name +
        ", Basic: " +
        basicSalary +
        ", Gross: " +
        getGrossSalary()
    );
  }

  public static Employee compare(
    Employee firstEmployee,
    Employee secondEmployee
  ) {
    if (
      firstEmployee.getGrossSalary() >= secondEmployee.getGrossSalary()
    ) return firstEmployee;
    return secondEmployee;
  }
}

public class Problem3 {

  public static void problem3() {
    System.out.println("\n===== Problem 3: Employee Salary =====");
    Employee employee1 = new Employee(1, "Aamir", 45000);
    Employee employee2 = new Employee(2, "Sara", 60000);
    Employee employee3 = new Employee(3, "Zoya", 52000);
    employee1.display();
    employee2.display();
    employee3.display();
    System.out.println(
      "Higher gross salary: " + Employee.compare(employee1, employee2).getName()
    );
  }
}
