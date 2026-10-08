"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodItem = void 0;
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
class FoodItem {
    constructor(id, name, category, _price, _available = true) {
        this.id = id;
        this.name = name;
        this.category = category;
        this._price = _price;
        this._available = _available;
        if (_price < 0) {
            throw new Error("Price cannot be negative");
        }
    }
    get price() {
        return this._price;
    }
    get available() {
        return this._available;
    }
    /** Restaurant can update the menu price at any time. */
    updatePrice(newPrice) {
        if (newPrice < 0) {
            throw new Error("Price cannot be negative");
        }
        this._price = newPrice;
    }
    setAvailable(available) {
        this._available = available;
    }
}
exports.FoodItem = FoodItem;
//# sourceMappingURL=FoodItem.js.map