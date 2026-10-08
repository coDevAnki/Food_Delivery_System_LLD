"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const Order_1 = require("./Order");
/**
 * Customer represents a user who places food orders.
 *
 * WHY THIS CLASS EXISTS:
 *   Models the customer entity and provides the entry point for
 *   creating orders. Keeps a history of all orders placed.
 *
 * RESPONSIBILITY:
 *   - Stores customer identity (id, name, email)
 *   - Creates orders (factory-like behavior for Order)
 *   - Maintains order history
 *
 * RELATIONSHIPS:
 *   - orders: Association (Customer references its orders)
 *   - The relationship is bidirectional: Customer → Order and Order → Customer
 *
 * WHY createOrder LIVES HERE:
 *   In the real world, "a customer places an order." The Customer is
 *   the actor initiating the action. FoodDeliverySystem could also
 *   create orders, but having it here models the domain naturally.
 *
 * SOLID:
 *   SRP — Customer manages customer identity and order creation.
 *   It does NOT process payments, manage delivery, etc.
 */
class Customer {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this._orders = [];
    }
    get orders() {
        return this._orders;
    }
    /**
     * Creates a new order from a specific restaurant.
     * The order starts in PLACED status with no items — items are added
     * separately via order.addItem() to allow building the order incrementally.
     */
    createOrder(restaurant) {
        Customer.orderCounter++;
        const orderId = `ORD-${Customer.orderCounter}`;
        const order = new Order_1.Order(orderId, this, restaurant);
        this._orders.push(order);
        return order;
    }
}
exports.Customer = Customer;
Customer.orderCounter = 0;
//# sourceMappingURL=Customer.js.map