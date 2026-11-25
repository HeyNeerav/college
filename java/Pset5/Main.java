import java.util.ArrayList;

// Problem 1
static class Calculator<T extends Number> {

  private T first;
  private T second;

  Calculator(T first, T second) {
    this.first = first;
    this.second = second;
  }

  void calculate() {
    double a = first.doubleValue();
    double b = second.doubleValue();
    System.out.println("Addition: " + (a + b));
    System.out.println("Subtraction: " + (a - b));
    System.out.println("Multiplication: " + a * b);
    if (b == 0) {
      System.out.println("Division: Cannot divide by zero.");
    } else {
      System.out.println("Division: " + a / b);
    }
  }
}

static void problem1() {
  System.out.println("\n========== Problem 1 ==========");
  new Calculator<>(20, 5).calculate();
  System.out.println();
  new Calculator<>(12.5, 2.5).calculate();
  System.out.println();
  new Calculator<>(10, 0).calculate();
}

// Problem 2
static class Box<T> {

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

static void problem2() {
  System.out.println("\n========== Problem 2 ==========");
  Box<Integer> integerBox = new Box<>(100);
  Box<String> stringBox = new Box<>("Hello Java");
  Box<Double> doubleBox = new Box<>(45.75);
  System.out.println("Integer: " + integerBox.getValue());
  System.out.println("String: " + stringBox.getValue());
  System.out.println("Double: " + doubleBox.getValue());
  stringBox.setValue("Updated value");
  System.out.println("Updated String: " + stringBox.getValue());
}

// Problem 3
static <T extends Comparable<? super T>> T findMax(T first, T second, T third) {
  T maximum = first;
  if (second.compareTo(maximum) > 0) maximum = second;
  if (third.compareTo(maximum) > 0) maximum = third;
  return maximum;
}

static void problem3() {
  System.out.println("\n========== Problem 3 ==========");
  System.out.println("Maximum Integer: " + findMax(10, 25, 15));
  System.out.println("Maximum Double: " + findMax(12.5, 9.8, 17.2));
  System.out.println("Maximum String: " + findMax("Apple", "Orange", "Banana"));
}

// Problem 4
static class Stack<T> {

  private ArrayList<T> elements = new ArrayList<>();

  void push(T value) {
    elements.add(value);
  }

  T pop() {
    if (isEmpty()) {
      System.out.println("Stack is empty. Cannot pop.");
      return null;
    }
    return elements.removeLast();
  }

  T peek() {
    if (isEmpty()) {
      System.out.println("Stack is empty.");
      return null;
    }
    return elements.getLast();
  }

  boolean isEmpty() {
    return elements.isEmpty();
  }
}

static void problem4() {
  System.out.println("\n========== Problem 4 ==========");
  Stack<Integer> integerStack = new Stack<>();
  integerStack.push(10);
  integerStack.push(20);
  integerStack.push(30);
  System.out.println("Integer stack top: " + integerStack.peek());
  System.out.println("Popped: " + integerStack.pop());
  System.out.println("Popped: " + integerStack.pop());

  Stack<String> stringStack = new Stack<>();
  stringStack.push("Java");
  stringStack.push("Python");
  System.out.println("String stack top: " + stringStack.peek());
  System.out.println("Popped: " + stringStack.pop());

  while (!integerStack.isEmpty()) integerStack.pop();
  integerStack.pop();
}

// Problem 5
static class Pair<K, V> {

  private K key;
  private V value;

  Pair(K key, V value) {
    this.key = key;
    this.value = value;
  }

  K getKey() {
    return key;
  }

  V getValue() {
    return value;
  }
}

static void problem5() {
  System.out.println("\n========== Problem 5 ==========");
  Pair<Integer, String> student = new Pair<>(101, "Aarav");
  Pair<Integer, Double> employee = new Pair<>(501, 55000.0);
  System.out.println("Student Roll Number: " + student.getKey());
  System.out.println("Student Name: " + student.getValue());
  System.out.println("Employee ID: " + employee.getKey());
  System.out.println("Employee Salary: " + employee.getValue());
}

// Problem 6
static class AscendingThread extends Thread {

  AscendingThread(String name) {
    super(name);
  }

  @Override
  public void run() {
    for (int number = 1; number <= 10; number++) {
      System.out.println(getName() + ": " + number);
    }
  }
}

static class DescendingThread extends Thread {

  DescendingThread(String name) {
    super(name);
  }

  @Override
  public void run() {
    for (int number = 10; number >= 1; number--) {
      System.out.println(getName() + ": " + number);
    }
  }
}

static void problem6() throws InterruptedException {
  System.out.println("\n========== Problem 6 ==========");
  Thread firstThread = new AscendingThread("Ascending Thread");
  Thread secondThread = new DescendingThread("Descending Thread");
  firstThread.start();
  secondThread.start();
  firstThread.join();
  secondThread.join();
}

// Problem 7
static class EvenNumbers implements Runnable {

  @Override
  public void run() {
    for (int number = 2; number <= 20; number += 2) {
      System.out.println(Thread.currentThread().getName() + ": " + number);
    }
  }
}

static class OddNumbers implements Runnable {

  @Override
  public void run() {
    for (int number = 1; number <= 20; number += 2) {
      System.out.println(Thread.currentThread().getName() + ": " + number);
    }
  }
}

static void problem7() throws InterruptedException {
  System.out.println("\n========== Problem 7 ==========");
  Thread evenThread = new Thread(new EvenNumbers(), "Even Thread");
  Thread oddThread = new Thread(new OddNumbers(), "Odd Thread");
  evenThread.start();
  oddThread.start();
  evenThread.join();
  oddThread.join();
}

// Problem 8
static class BankAccount {

  private double balance = 10000;

  synchronized void withdraw(double amount) {
    String threadName = Thread.currentThread().getName();
    if (balance >= amount) {
      System.out.println(threadName + " is withdrawing ₹" + amount);
      balance -= amount;
      System.out.println("Remaining balance: ₹" + balance);
    } else {
      System.out.println(threadName + ": Insufficient balance.");
    }
  }

  double getBalance() {
    return balance;
  }
}

static void problem8() throws InterruptedException {
  System.out.println("\n========== Problem 8 ==========");
  BankAccount account = new BankAccount();
  Thread firstThread = new Thread(() -> account.withdraw(7000), "Thread 1");
  Thread secondThread = new Thread(() -> account.withdraw(7000), "Thread 2");
  firstThread.start();
  secondThread.start();
  firstThread.join();
  secondThread.join();
  System.out.println("Final balance: ₹" + account.getBalance());
}

// Problem 9
static class Buffer {

  private Integer value;
  private boolean available;
  private boolean finished;

  synchronized void put(int number) throws InterruptedException {
    while (available) wait();
    value = number;
    available = true;
    System.out.println("Produced: " + number);
    notifyAll();
  }

  synchronized Integer take() throws InterruptedException {
    while (!available && !finished) wait();
    if (!available && finished) return null;

    int number = value;
    value = null;
    available = false;
    System.out.println("Consumed: " + number);
    notifyAll();
    return number;
  }

  synchronized void finish() {
    finished = true;
    notifyAll();
  }
}

static void problem9() throws InterruptedException {
  System.out.println("\n========== Problem 9 ==========");
  Buffer buffer = new Buffer();

  Thread producer = new Thread(() -> {
    try {
      for (int number = 1; number <= 5; number++) buffer.put(number);
      buffer.finish();
    } catch (InterruptedException exception) {
      Thread.currentThread().interrupt();
    }
  }, "Producer");

  Thread consumer = new Thread(() -> {
    try {
      while (buffer.take() != null) {}
    } catch (InterruptedException exception) {
      Thread.currentThread().interrupt();
    }
  }, "Consumer");

  producer.start();
  consumer.start();
  producer.join();
  consumer.join();
}

// Problem 10
static class NumberThread extends Thread {

  NumberThread(String name) {
    super(name);
  }

  @Override
  public void run() {
    for (int number = 1; number <= 5; number++) {
      System.out.println(getName() + ": " + number);
    }
  }
}

static void problem10() throws InterruptedException {
  System.out.println("\n========== Problem 10 ==========");
  NumberThread thread1 = new NumberThread("Thread1");
  NumberThread thread2 = new NumberThread("Thread2");
  NumberThread thread3 = new NumberThread("Thread3");

  thread1.start();
  thread1.join();
  thread2.start();
  thread2.join();
  thread3.start();
  thread3.join();

  System.out.println("All threads have completed execution.");
}

void main() throws InterruptedException {
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