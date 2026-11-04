import java.util.HashMap;

class Product {

  private int productId;
  private String name;
  private double price;
  private int quantity;

  public Product(int productId, String name, double price, int quantity) {
    this.productId = productId;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  public int getProductId() {
    return productId;
  }

  public void setPrice(double price) {
    if (price >= 0) this.price = price;
  }

  public void display() {
    System.out.println(
      productId + " - " + name + " - " + price + " - Quantity: " + quantity
    );
  }
}

public class Problem5 {

  public static void addProduct(
    HashMap<Integer, Product> catalogue,
    Product product
  ) {
    if (catalogue.containsKey(product.getProductId())) {
      System.out.println("Product ID already exists.");
      return;
    }
    catalogue.put(product.getProductId(), product);
  }

  public static void displayProducts(HashMap<Integer, Product> catalogue) {
    for (Product product : catalogue.values()) product.display();
  }

  public static void problem5() {
    System.out.println("\n===== Problem 5: Product Catalogue =====");
    HashMap<Integer, Product> catalogue = new HashMap<Integer, Product>();
    addProduct(catalogue, new Product(1, "Keyboard", 800, 10));
    addProduct(catalogue, new Product(2, "Mouse", 400, 20));
    addProduct(catalogue, new Product(1, "Duplicate", 900, 5));
    displayProducts(catalogue);
    Product foundProduct = catalogue.get(2);
    if (foundProduct != null) foundProduct.setPrice(450);
    catalogue.remove(1);
    System.out.println("After updating product 2 and removing product 1:");
    displayProducts(catalogue);
  }
}
