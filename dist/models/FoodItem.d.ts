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
export declare class FoodItem {
    readonly id: string;
    readonly name: string;
    readonly category: string;
    private _price;
    private _available;
    constructor(id: string, name: string, category: string, _price: number, _available?: boolean);
    get price(): number;
    get available(): boolean;
    /** Restaurant can update the menu price at any time. */
    updatePrice(newPrice: number): void;
    setAvailable(available: boolean): void;
}
//# sourceMappingURL=FoodItem.d.ts.map