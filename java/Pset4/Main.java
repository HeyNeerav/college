import java.util.ArrayList;
import java.util.InputMismatchException;
import java.util.List;
import java.util.Scanner;

void main() {
  problem1();
  problem2();
  problem3();
  problem4();
  problem5();
  problem6();
  problem7();
  problem8();
  problem9();
  problem10();
}

  // Problem 1: Employee Salary Management System
void problem1() {
  System.out.println("\n========== Problem 1 ==========");
  Employee permanent = new PermanentEmployee("Aarav", 101, 50000, 10000, 5000);
  Employee contract = new ContractEmployee("Meera", 102, 160, 500);
  permanent.displayDetails();
  System.out.printf("Salary: ₹%.2f%n%n", permanent.calculateSalary());
  contract.displayDetails();
  System.out.printf("Salary: ₹%.2f%n", contract.calculateSalary());
}

  // Problem 2: Payment Processing System
void problem2() {
  System.out.println("\n========== Problem 2 ==========");
  Payment[] payments = {
    new CreditCardPayment("**** 1234"),
    new UPIPayment("aarav@upi"),
    new CashPayment()
  };
  for (Payment payment : payments) {
    payment.makePayment(1250.50);
    payment.generateReceipt();
    System.out.println();
  }
}

// Problem 3: Shape Calculation Using Abstract Class and Interface
void problem3() {
  System.out.println("\n========== Problem 3 ==========");
  Shape[] shapes = { new Circle(5), new Rectangle(4, 6) };
  for (Shape shape : shapes) {
    shape.display();
    if (shape instanceof Drawable drawable) {
      drawable.draw();
    }
    System.out.printf("Area: %.2f%n%n", shape.calculateArea());
  }
}

// Problem 4: Multiple Inheritance Using Interfaces
void problem4() {
  System.out.println("\n========== Problem 4 ==========");
  MultiFunctionPrinter multiPrinter = new MultiFunctionPrinter();
  multiPrinter.print();
  multiPrinter.scan();
  BasicPrinter basicPrinter = new BasicPrinter();
  basicPrinter.print();
}

// Problem 5: Generic Storage Class
void problem5() {
  System.out.println("\n========== Problem 5 ==========");
  Box<Integer> integerBox = new Box<>(100);
  Box<String> stringBox = new Box<>("Hello Java");
  Box<Double> doubleBox = new Box<>(25.75);
  System.out.println("Integer box: " + integerBox.getValue());
  System.out.println("String box: " + stringBox.getValue());
  System.out.println("Double box: " + doubleBox.getValue());
  stringBox.setValue("Generics are useful");
  System.out.println("Updated string box: " + stringBox.getValue());
}

// Problem 6: Generic Method for Finding Maximum
void problem6() {
  System.out.println("\n========== Problem 6 ==========");
  System.out.println("Maximum Integer: " + findMaximum(10, 25, 15));
  System.out.println("Maximum Double: " + findMaximum(12.5, 9.8, 17.2));
  System.out.println("Maximum String: " + findMaximum("Apple", "Orange", "Banana"));
}

<T extends Comparable<? super T>> T findMaximum(T first, T second, T third) {
  T maximum = first;
  if (second.compareTo(maximum) > 0) maximum = second;
  if (third.compareTo(maximum) > 0) maximum = third;
  return maximum;
}

  // Problem 7: Wrapper Classes and Autoboxing
void problem7() {
  System.out.println("\n========== Problem 7 ==========");
  int number = 50;
  Integer wrappedNumber = number;
  int unwrappedNumber = wrappedNumber;
  System.out.println("Original int: " + number);
  System.out.println("Integer object: " + wrappedNumber);
  System.out.println("Unboxed int: " + unwrappedNumber);

  ArrayList<Integer> numbers = new ArrayList<>(List.of(10, 20, 30, 40, 50));
  int sum = 0;
  for (int value : numbers) sum += value;
  double average = (double) sum / numbers.size();
  System.out.println("Numbers: " + numbers);
  System.out.println("Sum: " + sum);
  System.out.println("Average: " + average);

  int parsedInteger = Integer.parseInt("250");
  double parsedDouble = Double.parseDouble("45.75");
  String convertedString = Integer.toString(500);
  System.out.println("Integer.parseInt(): " + parsedInteger);
  System.out.println("Double.parseDouble(): " + parsedDouble);
  System.out.println("Integer.toString(): " + convertedString);
}

// Problem 8: Bank Account Withdrawal System
void problem8() {
  System.out.println("\n========== Problem 8 ==========");
  BankAccount account = new BankAccount("AC101", 5000);
  try {
    account.withdraw(1500);
    account.withdraw(5000);
  } catch (IllegalArgumentException | InsufficientBalanceException exception) {
    System.out.println("Withdrawal failed: " + exception.getMessage());
  } finally {
    System.out.println("Withdrawal operation completed.");
    System.out.printf("Current balance: ₹%.2f%n", account.getBalance());
  }
}

// Problem 9: Multiple Exception Handling
void problem9() {
  System.out.println("\n========== Problem 9 ==========");
  Scanner scanner = new Scanner(System.in);
  try {
    System.out.print("Enter the numerator: ");
    double numerator = scanner.nextDouble();
    System.out.print("Enter the denominator: ");
    double denominator = scanner.nextDouble();
    if (denominator == 0) throw new ArithmeticException("Denominator cannot be zero.");
    System.out.println("Result: " + (numerator / denominator));
  } catch (ArithmeticException exception) {
    System.out.println("Arithmetic error: " + exception.getMessage());
  } catch (InputMismatchException exception) {
    System.out.println("Invalid input. Please enter numeric values.");
    scanner.nextLine();
  } finally {
    System.out.println("Program Execution Completed");
  }
}

  // Problem 10: Custom Exception - Student Eligibility
void problem10() {
  System.out.println("\n========== Problem 10 ==========");
  Student student = new Student("Riya", 17);
  try {
    student.checkEligibility();
  } catch (InvalidAgeException exception) {
    System.out.println("Eligibility check failed: " + exception.getMessage());
  }
}

// Problem 1: Employee hierarchy
abstract class Employee {
  private String name;
  private int employeeId;

  Employee(String name, int employeeId) {
    this.name = name;
    this.employeeId = employeeId;
  }

  abstract double calculateSalary();

  void displayDetails() {
    System.out.println("Employee name: " + name);
    System.out.println("Employee ID: " + employeeId);
  }
}

class PermanentEmployee extends Employee {
  private double basicSalary;
  private double hra;
  private double da;

  PermanentEmployee(String name, int employeeId, double basicSalary, double hra, double da) {
    super(name, employeeId);
    this.basicSalary = basicSalary;
    this.hra = hra;
    this.da = da;
  }

  @Override
  double calculateSalary() {
    return basicSalary + hra + da;
  }
}

class ContractEmployee extends Employee {
  private int hoursWorked;
  private double hourlyRate;

  ContractEmployee(String name, int employeeId, int hoursWorked, double hourlyRate) {
    super(name, employeeId);
    this.hoursWorked = hoursWorked;
    this.hourlyRate = hourlyRate;
  }

  @Override
  double calculateSalary() {
    return hoursWorked * hourlyRate;
  }
}

// Problem 2: Payment interface and implementations
interface Payment {
  void makePayment(double amount);
  void generateReceipt();
}

class CreditCardPayment implements Payment {
  private String cardNumber;
  private double paidAmount;

  CreditCardPayment(String cardNumber) {
    this.cardNumber = cardNumber;
  }

  @Override
  public void makePayment(double amount) {
    paidAmount = amount;
    System.out.printf("Paid ₹%.2f using credit card %s.%n", amount, cardNumber);
  }

  @Override
  public void generateReceipt() {
    System.out.printf("Credit card receipt: ₹%.2f%n", paidAmount);
  }
}

class UPIPayment implements Payment {
  private String upiId;
  private double paidAmount;

  UPIPayment(String upiId) {
    this.upiId = upiId;
  }

  @Override
  public void makePayment(double amount) {
    paidAmount = amount;
    System.out.printf("Paid ₹%.2f using UPI ID %s.%n", amount, upiId);
  }

  @Override
  public void generateReceipt() {
    System.out.printf("UPI receipt: ₹%.2f%n", paidAmount);
  }
}

class CashPayment implements Payment {
  private double paidAmount;

  @Override
  public void makePayment(double amount) {
    paidAmount = amount;
    System.out.printf("Paid ₹%.2f in cash.%n", amount);
  }

  @Override
  public void generateReceipt() {
    System.out.printf("Cash receipt: ₹%.2f%n", paidAmount);
  }
}

// Problem 3: Shape hierarchy and Drawable
interface Drawable {
  void draw();
}

abstract class Shape {
  abstract double calculateArea();

  void display() {
    System.out.println("Shape: " + getClass().getSimpleName());
  }
}

class Circle extends Shape implements Drawable {
  private double radius;

  Circle(double radius) {
    this.radius = radius;
  }

  @Override
  double calculateArea() {
    return Math.PI * radius * radius;
  }

  @Override
  public void draw() {
    System.out.println("Drawing a circle.");
  }
}

class Rectangle extends Shape implements Drawable {
  private double length;
  private double width;

  Rectangle(double length, double width) {
    this.length = length;
    this.width = width;
  }

  @Override
  double calculateArea() {
    return length * width;
  }

  @Override
  public void draw() {
    System.out.println("Drawing a rectangle.");
  }
}

// Problem 4: Multiple inheritance through interfaces
interface Printable {
  void print();
}

interface Scannable {
  void scan();
}

class MultiFunctionPrinter implements Printable, Scannable {
  @Override
  public void print() {
    System.out.println("Multi-function printer is printing.");
  }

  @Override
  public void scan() {
    System.out.println("Multi-function printer is scanning.");
  }
}

class BasicPrinter implements Printable {
  @Override
  public void print() {
    System.out.println("Basic printer is printing.");
  }
}

// Problem 5: Generic Box
class Box<T> {
  private T value;

  Box(T value) {
    this.value = value;
  }

  void setValue(T value) {
    this.value = value;
  }

  T getValue() {
    return value;
  }
}

// Problem 8: Bank account and exception
class BankAccount {
  private String accountNumber;
  private double balance;

  BankAccount(String accountNumber, double balance) {
    this.accountNumber = accountNumber;
    this.balance = balance;
  }

  void withdraw(double amount) throws InsufficientBalanceException {
    if (amount <= 0) {
      throw new IllegalArgumentException("Amount must be greater than zero.");
    }
    if (amount > balance) {
      throw new InsufficientBalanceException("Insufficient account balance.");
    }
    balance -= amount;
    System.out.printf("₹%.2f withdrawn from account %s.%n", amount, accountNumber);
  }

  double getBalance() {
    return balance;
  }
}

class InsufficientBalanceException extends Exception {
  InsufficientBalanceException(String message) {
    super(message);
  }
}

// Problem 10: Student eligibility and custom exception
class InvalidAgeException extends Exception {
  InvalidAgeException(String message) {
    super(message);
  }
}

class Student {
  private String name;
  private int age;

  Student(String name, int age) {
    this.name = name;
    this.age = age;
  }

  void checkEligibility() throws InvalidAgeException {
    if (age < 18) {
      throw new InvalidAgeException(name + " is under 18 years old.");
    }
    System.out.println("Student is Eligible");
  }
}
