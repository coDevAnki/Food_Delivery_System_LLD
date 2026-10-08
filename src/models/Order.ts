import { OrderStatus } from "../enums/OrderStatus";
import { OrderObserver, OrderEvent } from "../interfaces/OrderObserver";
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
export class Order {
  private _status: OrderStatus = OrderStatus.PLACED;
  private readonly _orderItems: OrderItem[] = [];
  private _deliveryPartner: DeliveryPartner | null = null;
  private _payment: Payment | null = null;

  /**
   * Using Set to prevent duplicate subscriptions.
   * If DeliveryService accidentally subscribes twice, Set silently deduplicates.
   */
  private readonly observers: Set<OrderObserver> = new Set();

  public readonly createdAt: Date = new Date();

  constructor(
    public readonly id: string,
    public readonly customer: Customer,
    public readonly restaurant: Restaurant
  ) {}

  // ──────────────────────────────────────────────
  // Accessors
  // ──────────────────────────────────────────────

  get status(): OrderStatus {
    return this._status;
  }

  get orderItems(): ReadonlyArray<OrderItem> {
    return this._orderItems;
  }

  get deliveryPartner(): DeliveryPartner | null {
    return this._deliveryPartner;
  }

  get payment(): Payment | null {
    return this._payment;
  }

  // ──────────────────────────────────────────────
  // Order Item Management
  // ──────────────────────────────────────────────

  /**
   * Add a food item to this order. Can only be done while the order is PLACED
   * (before the restaurant has accepted it).
   */
  addItem(foodItem: FoodItem, quantity: number): OrderItem {
    if (this._status !== OrderStatus.PLACED) {
      throw new Error("Cannot modify order after it has been accepted");
    }
    const orderItem = new OrderItem(foodItem, quantity);
    this._orderItems.push(orderItem);
    return orderItem;
  }

  /**
   * Total is calculated by aggregating OrderItem subtotals.
   * Each OrderItem uses its snapshotted priceAtPurchase, so this total
   * is immune to menu price changes.
   */
  getTotal(): number {
    return this._orderItems.reduce(
      (sum, item) => sum + item.getSubtotal(),
      0
    );
  }

  // ──────────────────────────────────────────────
  // Payment
  // ──────────────────────────────────────────────

  setPayment(payment: Payment): void {
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
  accept(): void {
    this.validateTransition(OrderStatus.PLACED, OrderStatus.ACCEPTED);
    this.transitionTo(OrderStatus.ACCEPTED);
  }

  /** Restaurant starts preparing the accepted order. */
  startPreparing(): void {
    this.validateTransition(OrderStatus.ACCEPTED, OrderStatus.PREPARING);
    this.transitionTo(OrderStatus.PREPARING);
  }

  /** Restaurant marks the order as ready for pickup. */
  markReadyForPickup(): void {
    this.validateTransition(OrderStatus.PREPARING, OrderStatus.READY_FOR_PICKUP);
    this.transitionTo(OrderStatus.READY_FOR_PICKUP);
  }

  /** Delivery partner picks up the order. */
  pickUp(): void {
    this.validateTransition(OrderStatus.READY_FOR_PICKUP, OrderStatus.PICKED_UP);
    if (!this._deliveryPartner) {
      throw new Error("Cannot pick up order without an assigned delivery partner");
    }
    this.transitionTo(OrderStatus.PICKED_UP);
  }

  /** Delivery partner delivers the order. */
  deliver(): void {
    this.validateTransition(OrderStatus.PICKED_UP, OrderStatus.DELIVERED);
    this.transitionTo(OrderStatus.DELIVERED);
  }

  /**
   * Cancel an order. Only valid before PICKED_UP.
   * Once the delivery partner has the food, cancellation is no longer logical.
   */
  cancel(): void {
    const cancellableStates: OrderStatus[] = [
      OrderStatus.PLACED,
      OrderStatus.ACCEPTED,
      OrderStatus.PREPARING,
      OrderStatus.READY_FOR_PICKUP,
    ];
    if (!cancellableStates.includes(this._status)) {
      throw new Error(
        `Cannot cancel order in status "${this._status}". ` +
        `Cancellation is only allowed before pickup.`
      );
    }
    const previous = this._status;
    this._status = OrderStatus.CANCELLED;
    this.notifyObservers(previous, OrderStatus.CANCELLED);
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

  assignDeliveryPartner(partner: DeliveryPartner): void {
    // Guard 1: Only assign during valid states
    const assignableStates: OrderStatus[] = [
      OrderStatus.ACCEPTED,
      OrderStatus.PREPARING,
      OrderStatus.READY_FOR_PICKUP,
    ];
    if (!assignableStates.includes(this._status)) {
      throw new Error(
        `Cannot assign delivery partner in status "${this._status}"`
      );
    }

    // Guard 2: Only one partner can be assigned (concurrency invariant)
    if (this._deliveryPartner !== null) {
      throw new Error(
        `Order already has delivery partner "${this._deliveryPartner.name}" assigned. ` +
        `Cannot assign "${partner.name}".`
      );
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

  subscribe(observer: OrderObserver): void {
    this.observers.add(observer);
  }

  unsubscribe(observer: OrderObserver): void {
    this.observers.delete(observer);
  }

  // ──────────────────────────────────────────────
  // Private Helpers
  // ──────────────────────────────────────────────

  private validateTransition(
    expectedCurrent: OrderStatus,
    target: OrderStatus
  ): void {
    if (this._status !== expectedCurrent) {
      throw new Error(
        `Invalid transition: cannot move from "${this._status}" to "${target}". ` +
        `Expected current status to be "${expectedCurrent}".`
      );
    }
  }

  private transitionTo(newStatus: OrderStatus): void {
    const previous = this._status;
    this._status = newStatus;
    this.notifyObservers(previous, newStatus);
  }

  private notifyObservers(
    previousStatus: OrderStatus,
    newStatus: OrderStatus
  ): void {
    const event: OrderEvent = {
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
