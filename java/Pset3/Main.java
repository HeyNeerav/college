import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;


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
// Problem 1
static class Person {
  String name;
  int age;

  Person(String name, int age) {
    this.name = name;
    this.age = age;
    System.out.println("Person constructor");
  }
}

static class CompanyEmployee extends Person {
  int employeeId;
  double salary;

  CompanyEmployee(String name, int age, int employeeId, double salary) {
    super(name, age);
    this.employeeId = employeeId;
    this.salary = salary;
    System.out.println("Employee constructor");
  }
}

static class Developer extends CompanyEmployee {
  String programmingLanguage;
  String projectName;

  Developer(String name, int age, int employeeId, double salary,
      String programmingLanguage, String projectName) {
    super(name, age, employeeId, salary);
    this.programmingLanguage = programmingLanguage;
    this.projectName = projectName;
    System.out.println("Developer constructor");
  }

  void display() {
    System.out.printf("Name: %s, Age: %d, ID: %d, Salary: %.2f, Language: %s, Project: %s%n",
        name, age, employeeId, salary, programmingLanguage, projectName);
  }
}

static void problem1() {
  System.out.println("\n--- Problem 1 ---");
  var developer = new Developer("Aarav", 24, 101, 65000, "Java", "Inventory API");
  developer.display();
}
// Problem 2
static class Calculator {
  void calculate(int a, int b) {
    System.out.println("calculate(int, int): " + (a + b));
  }

  void calculate(double a, double b) {
    System.out.println("calculate(double, double): " + (a + b));
  }

  void calculate(long a, long b) {
    System.out.println("calculate(long, long): " + (a + b));
  }

  void calculate(int a, double b) {
    System.out.println("calculate(int, double): " + (a + b));
  }
}

static void problem2() {
  System.out.println("\n--- Problem 2 ---");
  var calculator = new Calculator();
  calculator.calculate(10, 20);
  calculator.calculate(10L, 20L);
  calculator.calculate(10.5, 20.5);
  calculator.calculate(10, 20.5);
  calculator.calculate(10, (double) 20L); 
  calculator.calculate(10, 20.5f);  
}
// Problem 3
static class Vehicle {
  double calculateRent(int days) {
    return days * 1000.0;
  }
}

static class Car extends Vehicle {
  @Override
  double calculateRent(int days) {
    return super.calculateRent(days) + days * 250.0;
  }
}

static class LuxuryCar extends Car {
  @Override
  double calculateRent(int days) {
    return super.calculateRent(days) + days * 1000.0;
  }
}

static void problem3() {
  System.out.println("\n--- Problem 3 ---");
  Vehicle[] vehicles = { new Vehicle(), new Car(), new LuxuryCar() };
  for (var vehicle : vehicles) {
    System.out.printf("Rent for 3 days: %.2f%n", vehicle.calculateRent(3));
  }
}
// Problem 4
static class A {
  void show(Object value) {
    System.out.println("A-Object");
  }
}

static class B extends A {
  @Override
  void show(Object value) {
    System.out.println("B-Object");
  }

  void show(String value) {
    System.out.println("B-String");
  }
}

static void problem4() {
  System.out.println("\n--- Problem 4 ---");
  A a = new B();
  String text = "hello";
  Object object = text;
  a.show(text);   
  a.show(object); 
  a.show(null);   
}
// Problem 5
static class Account {
  String accountNumber;
  double balance;

  Account(String accountNumber, double balance) {
    this.accountNumber = accountNumber;
    this.balance = balance;
  }

  void deposit(double amount) {
    deposit(amount, "General deposit");
  }

  void deposit(double amount, String description) {
    if (amount <= 0) {
      System.out.println("Deposit must be positive.");
      return;
    }
    balance += amount;
    System.out.printf("%s: deposited %.2f (%s)%n", accountNumber, amount, description);
  }

  boolean withdraw(double amount) {
    if (amount <= 0 || amount > balance) {
      System.out.println("Withdrawal rejected for " + accountNumber);
      return false;
    }
    balance -= amount;
    return true;
  }

  double calculateInterest() {
    return 0;
  }

  void display() {
    System.out.printf("Account %s balance: %.2f%n", accountNumber, balance);
  }
}

static class SavingsAccount extends Account {
  SavingsAccount(String accountNumber, double balance) {
    super(accountNumber, balance);
  }

  @Override
  boolean withdraw(double amount) {
    if (amount > balance - 500) {
      System.out.println("Savings account must retain at least 500.");
      return false;
    }
    return super.withdraw(amount);
  }

  @Override
  double calculateInterest() {
    return balance * 0.04;
  }
}

static class CurrentAccount extends Account {
  CurrentAccount(String accountNumber, double balance) {
    super(accountNumber, balance);
  }

  @Override
  boolean withdraw(double amount) {
    if (amount <= 0 || amount > balance + 1000) {
      System.out.println("Current account overdraft limit exceeded.");
      return false;
    }
    balance -= amount;
    return true;
  }
}

static void problem5() {
  System.out.println("\n--- Problem 5 ---");
  Account[] accounts = { new SavingsAccount("S-101", 3000), new CurrentAccount("C-201", 1500) };
  accounts[0].deposit(500, "Monthly savings");
  accounts[0].withdraw(600);
  accounts[1].withdraw(2000);
  for (var account : accounts) {
    account.display();
    System.out.printf("Interest: %.2f%n", account.calculateInterest());
  }
}
// Problem 6
abstract static class Employee {
  String name;
  int employeeId;

  Employee(String name, int employeeId) {
    this.name = name;
    this.employeeId = employeeId;
  }

  abstract double calculateSalary();
}

static class PermanentEmployee extends Employee {
  double monthlySalary;

  PermanentEmployee(String name, int employeeId, double monthlySalary) {
    super(name, employeeId);
    this.monthlySalary = monthlySalary;
  }

  @Override
  double calculateSalary() {
    return monthlySalary;
  }

  double calculateSalary(double bonus) {
    return monthlySalary + bonus;
  }
}

static class ContractEmployee extends Employee {
  int hours;
  double hourlyRate;

  ContractEmployee(String name, int employeeId, int hours, double hourlyRate) {
    super(name, employeeId);
    this.hours = hours;
    this.hourlyRate = hourlyRate;
  }

  @Override
  double calculateSalary() {
    return hours * hourlyRate;
  }
}

static class CommissionEmployee extends Employee {
  double baseSalary;
  double sales;
  double commissionRate;

  CommissionEmployee(String name, int employeeId, double baseSalary, double sales, double commissionRate) {
    super(name, employeeId);
    this.baseSalary = baseSalary;
    this.sales = sales;
    this.commissionRate = commissionRate;
  }

  @Override
  double calculateSalary() {
    return baseSalary + sales * commissionRate;
  }
}

static void problem6() {
  System.out.println("\n--- Problem 6 ---");
  List<Employee> employees = List.of(
      new PermanentEmployee("Mira", 1, 50000),
      new ContractEmployee("Kabir", 2, 120, 400),
      new CommissionEmployee("Sara", 3, 20000, 150000, 0.05));

  for (var employee : employees) {
    System.out.printf("%s (ID %d): %.2f%n", employee.name, employee.employeeId, employee.calculateSalary());
  }
  var permanent = (PermanentEmployee) employees.getFirst();
  System.out.printf("Permanent employee with bonus: %.2f%n", permanent.calculateSalary(5000));
}
// Problem 7
static class Animal {
  Animal reproduce() {
    return new Animal();
  }

  void sound(String kind) {
    System.out.println("Animal sound: " + kind);
  }
}

static class Dog extends Animal {
  @Override
  Dog reproduce() {
    return new Dog();
  }

  void sound(int volume) {
    System.out.println("Dog bark volume: " + volume);
  }
}

static void problem7() {
  System.out.println("\n--- Problem 7 ---");
  Animal animal = new Dog();
  Dog dog = new Dog();
  System.out.println("Animal reference result: " + animal.reproduce().getClass().getSimpleName());
  System.out.println("Dog reference result: " + dog.reproduce().getClass().getSimpleName());
  dog.sound("friendly");
  dog.sound(5);
}
// Problem 8
abstract static class Shape {
  abstract double area();
  abstract double perimeter();

  boolean compareArea(Shape other) {
    return Double.compare(area(), other.area()) > 0;
  }

  boolean compareArea(double otherArea) {
    return Double.compare(area(), otherArea) > 0;
  }
}

static class Circle extends Shape {
  double radius;

  Circle(double radius) { this.radius = radius; }
  Circle(double diameter, boolean isDiameter) { this.radius = isDiameter ? diameter / 2 : diameter; }

  @Override double area() { return Math.PI * radius * radius; }
  @Override double perimeter() { return 2 * Math.PI * radius; }
}

static class Rectangle extends Shape {
  double width;
  double height;

  Rectangle(double width, double height) { this.width = width; this.height = height; }
  Rectangle(double side) { this(side, side); }

  @Override double area() { return width * height; }
  @Override double perimeter() { return 2 * (width + height); }
}

static class Triangle extends Shape {
  double a;
  double b;
  double c;

  Triangle(double a, double b, double c) {
    if (a + b <= c || a + c <= b || b + c <= a) {
      throw new IllegalArgumentException("Invalid triangle sides");
    }
    this.a = a; this.b = b; this.c = c;
  }

  @Override double area() {
    double s = perimeter() / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  }

  @Override double perimeter() { return a + b + c; }
}

static void problem8() {
  System.out.println("\n--- Problem 8 ---");
  List<Shape> shapes = new ArrayList<>(List.of(
      new Circle(3), new Rectangle(4, 6), new Triangle(3, 4, 5), new Rectangle(5)));
  shapes.sort(Comparator.comparingDouble(Shape::area).reversed());
  for (var shape : shapes) {
    System.out.printf("%s: area=%.2f, perimeter=%.2f%n",
        shape.getClass().getSimpleName(), shape.area(), shape.perimeter());
  }
  System.out.println("Largest shape bigger than area 20? " + shapes.getFirst().compareArea(20));
}
// Problem 9
static class FileProcessor {
  void process(String filename) throws IOException {
    System.out.println("Processing file: " + filename);
  }

  void process(String filename, String mode) throws IOException {
    System.out.println("Processing " + filename + " in " + mode + " mode");
  }
}

static class TextProcessor extends FileProcessor {
  @Override
  void process(String filename) {
    System.out.println("Reading text file: " + filename);
  }

  @Override
  void process(String filename, String mode) throws IOException {
    if (filename == null || filename.isBlank()) {
      throw new IOException("Filename cannot be empty");
    }
    System.out.println("Text processing mode " + mode + ": " + filename);
  }
}

static class ImageProcessor extends FileProcessor {
  @Override
  void process(String filename) throws IOException {
    if (filename == null || !filename.matches("(?i).+\\.(png|jpg|jpeg|gif)")) {
      throw new IOException("Unsupported image filename");
    }
    System.out.println("Processing image: " + filename);
  }
}

static void problem9() {
  System.out.println("\n--- Problem 9 ---");
  FileProcessor[] processors = { new TextProcessor(), new ImageProcessor() };
  try {
    processors[0].process("notes.txt");
    processors[0].process("notes.txt", "FAST");
    processors[1].process("photo.png");
    processors[1].process("document.pdf");
  } catch (IOException exception) {
    System.out.println("Processing error: " + exception.getMessage());
  }
}
// Problem 10
static class Payment {
  String customer;

  Payment(String customer) {
    this.customer = customer;
  }

  boolean processPayment(double amount) {
    return processPayment(amount, "NO-REFERENCE");
  }

  boolean processPayment(double amount, String reference) {
    if (amount <= 0 || !Double.isFinite(amount)) {
      System.out.println("Invalid payment amount.");
      return false;
    }
    System.out.printf("Payment %.2f for %s, reference %s%n", amount, customer, reference);
    return true;
  }
}

static class CreditCardPayment extends Payment {
  CreditCardPayment(String customer) { super(customer); }

  @Override
  boolean processPayment(double amount, String reference) {
    if (!validAmount(amount)) return false;
    System.out.println("Verifying card and authorizing payment...");
    return super.processPayment(amount, reference);
  }
}

static class UPIPayment extends Payment {
  UPIPayment(String customer) { super(customer); }

  @Override
  boolean processPayment(double amount, String reference) {
    if (!validAmount(amount)) return false;
    System.out.println("Sending UPI collect request...");
    return super.processPayment(amount, reference);
  }
}

static class NetBankingPayment extends Payment {
  NetBankingPayment(String customer) { super(customer); }

  @Override
  boolean processPayment(double amount, String reference) {
    if (!validAmount(amount)) return false;
    System.out.println("Redirecting to bank authentication...");
    return super.processPayment(amount, reference);
  }
}

static boolean validAmount(double amount) {
  if (amount <= 0 || !Double.isFinite(amount)) {
    System.out.println("Invalid payment amount.");
    return false;
  }
  return true;
}

static void problem10() {
  System.out.println("\n--- Problem 10 ---");
  record OrderPayment(Payment payment, double amount, String reference) {}
  var orders = List.of(
      new OrderPayment(new CreditCardPayment("Aarav"), 2499.00, "CC-1001"),
      new OrderPayment(new UPIPayment("Mira"), 799.00, "UPI-1002"),
      new OrderPayment(new NetBankingPayment("Kabir"), 4999.00, "NB-1003"));

  for (var order : orders) {
    order.payment().processPayment(order.amount(), order.reference());
  }
  new UPIPayment("Test User").processPayment(-10, "INVALID-1");
}
