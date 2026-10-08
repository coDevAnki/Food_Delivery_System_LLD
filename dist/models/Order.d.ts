import { OrderStatus } from "../enums/OrderStatus";
import { OrderObserver } from "../interfaces/OrderObserver";
import { Customer } from "./Customer";
import { Restaurant } from "./Restaurant";
import { OrderItem } from "./OrderItem";
import { DeliveryPartner } from "./DeliveryPartner";
import { Payment } from "./Payment";
import { FoodItem } from "./FoodItem";
/**
 * Order is the central domain entity in this system.
 *
 * WHY THIS CLASS EXISTS:
 *   It models a customer's food order from a restaurant, managing:
 *   - What was ordered (OrderItem[])
 *   - The order lifecycle (status transitions)
 *   - Who is involved (customer, restaurant, delivery partner)
 *   - Payment association
 *   - Event publishing (Observer pattern)
 *
 * RESPONSIBILITY:
 *   1. Owns the collection of OrderItems (composition)
 *   2. Enforces valid state transitions (no public setStatus)
 *   3. Guarantees the delivery-partner-assignment invariant (at most one)
 *   4. Calculates order total by aggregating OrderItem subtotals
 *   5. Publishes lifecycle events to observers
 *
 * WHAT ORDER DOES NOT DO:
 *   - Process payments (that's Payment + PaymentMethod)
 *   - Select delivery partners (that's DeliveryService + Strategy)
 *   - Send notifications (that's NotificationObserver)
 *
 * RELATIONSHIPS:
 *   - customer: Association (Customer exists independently)
 *   - restaurant: Association (Restaurant exists independently)
 *   - orderItems: Composition (OrderItems are created for this Order)
 *   - payment: Association (Payment is created separately and linked)
 *   - deliveryPartner: Association (assigned later, nullable)
 *   - observers: Dependency (Order depends on OrderObserver abstraction)
 *
 * DESIGN PATTERNS:
 *   Observer — Order publishes events; services subscribe.
 *   The Order does NOT know about DeliveryService or NotificationService.
 *   It only knows about the OrderObserver interface.
 *
 * CONCURRENCY:
 *   assignDeliveryPartner() guards against double-assignment.
 *   In single-threaded JS this is naturally safe, but the guard logic
 *   demonstrates the invariant that needs protection in production.
 *
 * SOLID:
 *   SRP — Order manages order state and items, not payment processing or delivery.
 *   OCP — New observers can be added without modifying Order.
 *   DIP — Order depends on OrderObserver (abstraction), not on concrete services.
 */
export declare class Order {
    readonly id: string;
    readonly customer: Customer;
    readonly restaurant: Restaurant;
    private _status;
    private readonly _orderItems;
    private _deliveryPartner;
    private _payment;
    /**
     * Using Set to prevent duplicate subscriptions.
     * If DeliveryService accidentally subscribes twice, Set silently deduplicates.
     */
    private readonly observers;
    readonly createdAt: Date;
    constructor(id: string, customer: Customer, restaurant: Restaurant);
    get status(): OrderStatus;
    get orderItems(): ReadonlyArray<OrderItem>;
    get deliveryPartner(): DeliveryPartner | null;
    get payment(): Payment | null;
    /**
     * Add a food item to this order. Can only be done while the order is PLACED
     * (before the restaurant has accepted it).
     */
    addItem(foodItem: FoodItem, quantity: number): OrderItem;
    /**
     * Total is calculated by aggregating OrderItem subtotals.
     * Each OrderItem uses its snapshotted priceAtPurchase, so this total
     * is immune to menu price changes.
     */
    getTotal(): number;
    setPayment(payment: Payment): void;
    /** Restaurant accepts a placed order. */
    accept(): void;
    /** Restaurant starts preparing the accepted order. */
    startPreparing(): void;
    /** Restaurant marks the order as ready for pickup. */
    markReadyForPickup(): void;
    /** Delivery partner picks up the order. */
    pickUp(): void;
    /** Delivery partner delivers the order. */
    deliver(): void;
    /**
     * Cancel an order. Only valid before PICKED_UP.
     * Once the delivery partner has the food, cancellation is no longer logical.
     */
    cancel(): void;
    assignDeliveryPartner(partner: DeliveryPartner): void;
    subscribe(observer: OrderObserver): void;
    unsubscribe(observer: OrderObserver): void;
    private validateTransition;
    private transitionTo;
    private notifyObservers;
}
//# sourceMappingURL=Order.d.ts.map