"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const OrderStatus_1 = require("../enums/OrderStatus");
const OrderItem_1 = require("./OrderItem");
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
class Order {
    constructor(id, customer, restaurant) {
        this.id = id;
        this.customer = customer;
        this.restaurant = restaurant;
        this._status = OrderStatus_1.OrderStatus.PLACED;
        this._orderItems = [];
        this._deliveryPartner = null;
        this._payment = null;
        /**
         * Using Set to prevent duplicate subscriptions.
         * If DeliveryService accidentally subscribes twice, Set silently deduplicates.
         */
        this.observers = new Set();
        this.createdAt = new Date();
    }
    // ──────────────────────────────────────────────
    // Accessors
    // ──────────────────────────────────────────────
    get status() {
        return this._status;
    }
    get orderItems() {
        return this._orderItems;
    }
    get deliveryPartner() {
        return this._deliveryPartner;
    }
    get payment() {
        return this._payment;
    }
    // ──────────────────────────────────────────────
    // Order Item Management
    // ──────────────────────────────────────────────
    /**
     * Add a food item to this order. Can only be done while the order is PLACED
     * (before the restaurant has accepted it).
     */
    addItem(foodItem, quantity) {
        if (this._status !== OrderStatus_1.OrderStatus.PLACED) {
            throw new Error("Cannot modify order after it has been accepted");
        }
        const orderItem = new OrderItem_1.OrderItem(foodItem, quantity);
        this._orderItems.push(orderItem);
        return orderItem;
    }
    /**
     * Total is calculated by aggregating OrderItem subtotals.
     * Each OrderItem uses its snapshotted priceAtPurchase, so this total
     * is immune to menu price changes.
     */
    getTotal() {
        return this._orderItems.reduce((sum, item) => sum + item.getSubtotal(), 0);
    }
    // ──────────────────────────────────────────────
    // Payment
    // ──────────────────────────────────────────────
    setPayment(payment) {
        if (this._payment) {
            throw new Error("Payment already set for this order");
        }
        this._payment = payment;
    }
    // ──────────────────────────────────────────────
    // State Transitions
    //
    // Each method validates the current state before transitioning.
    // There is no public setStatus() — the Order owns its invariants.
    // ──────────────────────────────────────────────
    /** Restaurant accepts a placed order. */
    accept() {
        this.validateTransition(OrderStatus_1.OrderStatus.PLACED, OrderStatus_1.OrderStatus.ACCEPTED);
        this.transitionTo(OrderStatus_1.OrderStatus.ACCEPTED);
    }
    /** Restaurant starts preparing the accepted order. */
    startPreparing() {
        this.validateTransition(OrderStatus_1.OrderStatus.ACCEPTED, OrderStatus_1.OrderStatus.PREPARING);
        this.transitionTo(OrderStatus_1.OrderStatus.PREPARING);
    }
    /** Restaurant marks the order as ready for pickup. */
    markReadyForPickup() {
        this.validateTransition(OrderStatus_1.OrderStatus.PREPARING, OrderStatus_1.OrderStatus.READY_FOR_PICKUP);
        this.transitionTo(OrderStatus_1.OrderStatus.READY_FOR_PICKUP);
    }
    /** Delivery partner picks up the order. */
    pickUp() {
        this.validateTransition(OrderStatus_1.OrderStatus.READY_FOR_PICKUP, OrderStatus_1.OrderStatus.PICKED_UP);
        if (!this._deliveryPartner) {
            throw new Error("Cannot pick up order without an assigned delivery partner");
        }
        this.transitionTo(OrderStatus_1.OrderStatus.PICKED_UP);
    }
    /** Delivery partner delivers the order. */
    deliver() {
        this.validateTransition(OrderStatus_1.OrderStatus.PICKED_UP, OrderStatus_1.OrderStatus.DELIVERED);
        this.transitionTo(OrderStatus_1.OrderStatus.DELIVERED);
    }
    /**
     * Cancel an order. Only valid before PICKED_UP.
     * Once the delivery partner has the food, cancellation is no longer logical.
     */
    cancel() {
        const cancellableStates = [
            OrderStatus_1.OrderStatus.PLACED,
            OrderStatus_1.OrderStatus.ACCEPTED,
            OrderStatus_1.OrderStatus.PREPARING,
            OrderStatus_1.OrderStatus.READY_FOR_PICKUP,
        ];
        if (!cancellableStates.includes(this._status)) {
            throw new Error(`Cannot cancel order in status "${this._status}". ` +
                `Cancellation is only allowed before pickup.`);
        }
        const previous = this._status;
        this._status = OrderStatus_1.OrderStatus.CANCELLED;
        this.notifyObservers(previous, OrderStatus_1.OrderStatus.CANCELLED);
    }
    // ──────────────────────────────────────────────
    // Delivery Partner Assignment
    //
    // CONCURRENCY INVARIANT:
    //   Only one delivery partner can be assigned to an order.
    //   In synchronous JS, the null-check is sufficient.
    //   In a concurrent/distributed system, this would need:
    //     - Database-level optimistic locking (version column)
    //     - Or a compare-and-swap / mutex
    //   See the post-implementation notes for details.
    // ──────────────────────────────────────────────
    assignDeliveryPartner(partner) {
        // Guard 1: Only assign during valid states
        const assignableStates = [
            OrderStatus_1.OrderStatus.ACCEPTED,
            OrderStatus_1.OrderStatus.PREPARING,
            OrderStatus_1.OrderStatus.READY_FOR_PICKUP,
        ];
        if (!assignableStates.includes(this._status)) {
            throw new Error(`Cannot assign delivery partner in status "${this._status}"`);
        }
        // Guard 2: Only one partner can be assigned (concurrency invariant)
        if (this._deliveryPartner !== null) {
            throw new Error(`Order already has delivery partner "${this._deliveryPartner.name}" assigned. ` +
                `Cannot assign "${partner.name}".`);
        }
        // Perform assignment
        this._deliveryPartner = partner;
        partner.assignToOrder(this.id);
    }
    // ──────────────────────────────────────────────
    // Observer Pattern
    //
    // subscribe/unsubscribe/notify follow the classic Observer pattern.
    // Using a Set ensures no duplicate subscriptions.
    // ──────────────────────────────────────────────
    subscribe(observer) {
        this.observers.add(observer);
    }
    unsubscribe(observer) {
        this.observers.delete(observer);
    }
    // ──────────────────────────────────────────────
    // Private Helpers
    // ──────────────────────────────────────────────
    validateTransition(expectedCurrent, target) {
        if (this._status !== expectedCurrent) {
            throw new Error(`Invalid transition: cannot move from "${this._status}" to "${target}". ` +
                `Expected current status to be "${expectedCurrent}".`);
        }
    }
    transitionTo(newStatus) {
        const previous = this._status;
        this._status = newStatus;
        this.notifyObservers(previous, newStatus);
    }
    notifyObservers(previousStatus, newStatus) {
        const event = {
            order: this,
            previousStatus,
            newStatus,
            timestamp: new Date(),
        };
        for (const observer of this.observers) {
            observer.onOrderEvent(event);
        }
    }
}
exports.Order = Order;
//# sourceMappingURL=Order.js.map