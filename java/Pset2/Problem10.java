import java.util.HashMap;

class CartProduct {

  private int productId;
  private String name;
  private double price;

  public CartProduct(int productId, String name, double price) {
    this.productId = productId;
    this.name = name;
    this.price = price;
  }

  public int getProductId() {
    return productId;
  }

  public String getName() {
    return name;
  }

  public double getPrice() {
    return price;
  }
}

class CartItem {

  private CartProduct product;
  private int quantity;

  public CartItem(CartProduct product, int quantity) {
    this.product = product;
    this.quantity = quantity;
  }

  public CartProduct getProduct() {
    return product;
  }

  public int getQuantity() {
    return quantity;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }

  public double getAmount() {
    return product.getPrice() * quantity;
  }

  public void display() {
    System.out.printf(
      "%-18s %8d %12.2f%n",
      product.getName(),
      quantity,
      getAmount()
    );
  }
}

class ShoppingCart {

  private HashMap<Integer, CartItem> items = new HashMap<Integer, CartItem>();

  public void addProduct(CartProduct product, int quantity) {
    if (quantity <= 0) {
      System.out.println("Quantity must be positive.");
      return;
    }
    CartItem item = items.get(product.getProductId());
    if (item == null) items.put(
      product.getProductId(),
      new CartItem(product, quantity)
    );
    else item.setQuantity(item.getQuantity() + quantity);
  }

  public void updateQuantity(int productId, int quantity) {
    if (quantity <= 0) {
      System.out.println("Quantity must be positive.");
      return;
    }
    CartItem item = items.get(productId);
    if (item == null) System.out.println("Product not found.");
    else item.setQuantity(quantity);
  }

  public void removeProduct(int productId) {
    if (items.remove(productId) == null) System.out.println(
      "Product not found."
    );
  }

  public double getSubtotal() {
    double subtotal = 0;
    for (CartItem item : items.values()) subtotal += item.getAmount();
    return subtotal;
  }

  public double getDiscount() {
    double subtotal = getSubtotal();
    if (subtotal >= 5000) return subtotal * 0.10;
    else if (subtotal >= 1000) return subtotal * 0.05;
    return 0;
  }

  public void displayCart() {
    System.out.printf("%-18s %8s %12s%n", "Product", "Quantity", "Amount");
    System.out.println("------------------------------------------");
    for (CartItem item : items.values()) item.display();
    double subtotal = getSubtotal();
    double discount = getDiscount();
    System.out.println("------------------------------------------");
    System.out.printf("%-26s %12.2f%n", "Subtotal:", subtotal);
    System.out.printf("%-26s %12.2f%n", "Discount:", discount);
    System.out.printf("%-26s %12.2f%n", "Final Amount:", subtotal - discount);
  }
}

public class Problem10 {

  public static void problem10() {
    System.out.println("\n===== Problem 10: Shopping Cart =====");
    ShoppingCart cart = new ShoppingCart();
    cart.addProduct(new CartProduct(1, "Keyboard", 800), 2);
    cart.addProduct(new CartProduct(2, "Mouse", 700), 1);
    cart.addProduct(new CartProduct(1, "Keyboard", 800), 1);
    cart.displayCart();
  }
}
