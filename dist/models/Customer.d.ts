import { Order } from "./Order";
import { Restaurant } from "./Restaurant";
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
export declare class Customer {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    private readonly _orders;
    private static orderCounter;
    constructor(id: string, name: string, email: string);
    get orders(): ReadonlyArray<Order>;
    /**
     * Creates a new order from a specific restaurant.
     * The order starts in PLACED status with no items — items are added
     * separately via order.addItem() to allow building the order incrementally.
     */
    createOrder(restaurant: Restaurant): Order;
}
//# sourceMappingURL=Customer.d.ts.map