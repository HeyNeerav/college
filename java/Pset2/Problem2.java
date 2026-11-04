class BankAccount {

  private int accountNumber;
  private String accountHolder;
  private double balance;

  public BankAccount(int accountNumber, String accountHolder) {
    this.accountNumber = accountNumber;
    this.accountHolder = accountHolder;
    this.balance = 0;
  }

  public BankAccount(int accountNumber, String accountHolder, double balance) {
    this.accountNumber = accountNumber;
    this.accountHolder = accountHolder;
    this.balance = balance;
  }

  public void deposit(double amount) {
    if (amount < 0) System.out.println("Amount cannot be negative.");
    else balance += amount;
  }

  public void withdraw(double amount) {
    if (amount < 0) System.out.println("Amount cannot be negative.");
    else if (amount > balance) System.out.println("Insufficient balance.");
    else balance -= amount;
  }

  public void displayBalance() {
    System.out.println(
      "Account " + accountNumber + " (" + accountHolder + "): " + balance
    );
  }
}

public class Problem2 {

  public static void problem2() {
    System.out.println("\n===== Problem 2: Bank Account =====");
    BankAccount firstAccount = new BankAccount(1001, "Aamir");
    BankAccount secondAccount = new BankAccount(1002, "Sara", 5000);
    firstAccount.deposit(2000);
    secondAccount.withdraw(1500);
    firstAccount.displayBalance();
    secondAccount.displayBalance();
  }
}
