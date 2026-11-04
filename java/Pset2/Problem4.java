import java.util.ArrayList;

class Book {

  private String isbn, title, author;
  private double price;

  public Book(String isbn, String title, String author, double price) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.price = price;
  }

  public String getIsbn() {
    return isbn;
  }

  public void display() {
    System.out.println(isbn + " - " + title + " - " + author + " - " + price);
  }
}

public class Problem4 {

  public static void addBook(ArrayList<Book> books, Book newBook) {
    if (searchBook(books, newBook.getIsbn()) != null) {
      System.out.println("Book ISBN already exists.");
      return;
    }
    books.add(newBook);
  }

  public static Book searchBook(ArrayList<Book> books, String isbn) {
    for (Book book : books) if (book.getIsbn().equals(isbn)) return book;
    return null;
  }

  public static void removeBook(ArrayList<Book> books, String isbn) {
    Book book = searchBook(books, isbn);
    if (book == null) System.out.println("Book not found.");
    else books.remove(book);
  }

  public static void displayBooks(ArrayList<Book> books) {
    for (Book book : books) book.display();
  }

  public static void problem4() {
    System.out.println("\n===== Problem 4: Library Inventory =====");
    ArrayList<Book> books = new ArrayList<Book>();
    addBook(books, new Book("B101", "Java Basics", "Ali", 450));
    addBook(books, new Book("B102", "OOP in Java", "Sara", 550));
    addBook(books, new Book("B101", "Duplicate", "Someone", 300));
    displayBooks(books);
    Book foundBook = searchBook(books, "B102");
    if (foundBook != null) {
      System.out.println("Found book:");
      foundBook.display();
    }
    removeBook(books, "B101");
    System.out.println("After removing B101:");
    displayBooks(books);
  }
}
