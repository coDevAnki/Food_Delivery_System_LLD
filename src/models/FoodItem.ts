/**
 * FoodItem represents a single dish on a restaurant's menu.
 *
 * WHY THIS CLASS EXISTS:
 *   It models the menu-level information for a dish.
 *   It is NOT the same as what appears in an order — that's OrderItem's job.
 *
 * RESPONSIBILITY:
 *   Owns name, category, current price, and availability.
 *   The `price` here is the CURRENT menu price. When a customer orders,
 *   OrderItem snapshots this price as `priceAtPurchase`.
 *
 * RELATIONSHIPS:
 *   - Composed inside Menu (Menu owns FoodItems)
 *   - Referenced by OrderItem (OrderItem points to the FoodItem it was created from)
 *
 * SOLID:
 *   SRP — FoodItem only knows about menu-level dish information.
 *   It does NOT calculate order totals, manage availability across restaurants, etc.
 */
export class FoodItem {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly category: string,
    private _price: number,
    private _available: boolean = true
  ) {
    if (_price < 0) {
      throw new Error("Price cannot be negative");
    }
  }

  get price(): number {
    return this._price;
  }

  get available(): boolean {
    return this._available;
  }

  /** Restaurant can update the menu price at any time. */
  updatePrice(newPrice: number): void {
    if (newPrice < 0) {
      throw new Error("Price cannot be negative");
    }
    this._price = newPrice;
  }

  setAvailable(available: boolean): void {
    this._available = available;
  }
}
