import { FoodItem } from "./FoodItem";

/**
 * OrderItem represents a specific food item within a particular order.
 *
 * WHY THIS CLASS EXISTS:
 *   This is one of the most important design decisions in the system.
 *
 *   Naive approach: Order → FoodItem[]
 *     Problems:
 *       1. No way to store quantity (do you add the same FoodItem 3 times?)
 *       2. No way to preserve the price at purchase time.
 *          If the restaurant raises the price of "Butter Chicken" from ₹350
 *          to ₹400, all past orders would retroactively show ₹400.
 *       3. The order total becomes impossible to calculate correctly.
 *
 *   Correct approach: Order → OrderItem[] → FoodItem
 *     OrderItem snapshots the price at the moment of ordering.
 *     Even if FoodItem.price changes later, OrderItem.priceAtPurchase is immutable.
 *
 * RESPONSIBILITY:
 *   - Stores which FoodItem was ordered
 *   - Stores the quantity
 *   - Snapshots the price at purchase time (immutable after creation)
 *   - Calculates its own subtotal (price × quantity)
 *
 * RELATIONSHIP:
 *   - References FoodItem (association — the FoodItem exists independently on the menu)
 *   - Composed inside Order (an OrderItem doesn't exist outside an Order)
 *
 * SOLID:
 *   SRP — OrderItem only knows about one line in an order.
 *   Order delegates subtotal calculation to OrderItem rather than computing it itself.
 */
export class OrderItem {
  public readonly priceAtPurchase: number;

  constructor(
    public readonly foodItem: FoodItem,
    public readonly quantity: number
  ) {
    if (quantity <= 0) {
      throw new Error("Quantity must be positive");
    }
    if (!foodItem.available) {
      throw new Error(`"${foodItem.name}" is currently unavailable`);
    }
    // Snapshot the current price — this value never changes.
    this.priceAtPurchase = foodItem.price;
  }

  /**
   * Subtotal = price at purchase × quantity.
   * This is a derived value, so it's a method rather than a stored field.
   */
  getSubtotal(): number {
    return this.priceAtPurchase * this.quantity;
  }
}
