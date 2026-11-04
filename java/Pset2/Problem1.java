class StudentResult {

  private int rollNumber;
  private String name;
  private int mark1, mark2, mark3;

  public StudentResult(
    int rollNumber,
    String name,
    int mark1,
    int mark2,
    int mark3
  ) {
    this.rollNumber = rollNumber;
    this.name = name;
    this.mark1 = mark1;
    this.mark2 = mark2;
    this.mark3 = mark3;
  }

  public int getTotal() {
    return mark1 + mark2 + mark3;
  }

  public double getPercentage() {
    return getTotal() / 3.0;
  }

  public String getGrade() {
    double percentage = getPercentage();
    if (percentage >= 90) return "A";
    else if (percentage >= 75) return "B";
    else if (percentage >= 60) return "C";
    else return "D";
  }

  public void display() {
    System.out.println("Roll Number: " + rollNumber);
    System.out.println("Name: " + name);
    System.out.println("Total Marks: " + getTotal() + " / 300");
    System.out.println("Percentage: " + getPercentage() + "%");
    System.out.println("Grade: " + getGrade());
  }
}

public class Problem1 {

  public static void problem1() {
    System.out.println("===== Problem 1: Student Result =====");
    StudentResult student = new StudentResult(101, "Aamir", 85, 90, 80);
    student.display();
  }
}
