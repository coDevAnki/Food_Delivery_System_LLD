import { OrderObserver, OrderEvent } from "../interfaces/OrderObserver";
import { DeliveryAssignmentStrategy } from "../interfaces/DeliveryAssignmentStrategy";
import { DeliveryPartner } from "../models/DeliveryPartner";
import { Order } from "../models/Order";
/**
 * DeliveryService manages delivery partners and handles delivery assignment.
 *
 * WHY THIS CLASS EXISTS:
 *   It separates delivery concerns from Order and Restaurant:
 *     - Order knows it has a delivery partner, but doesn't select one.
 *     - Restaurant prepares food, but doesn't manage delivery.
 *     - DeliveryService owns the pool of partners and the assignment logic.
 *
 * RESPONSIBILITY:
 *   1. Manages the pool of delivery partners
 *   2. Listens for order events (Observer pattern) to trigger assignment
 *   3. Uses a DeliveryAssignmentStrategy to select a partner (Strategy pattern)
 *   4. Assigns the selected partner to the order
 *
 * DESIGN PATTERNS USED:
 *
 *   Observer: DeliveryService implements OrderObserver.
 *     When an order transitions to PREPARING, DeliveryService automatically
 *     begins the assignment process. Order doesn't call DeliveryService
 *     directly — it just publishes an event.
 *
 *   Strategy: DeliveryService delegates partner selection to a
 *     DeliveryAssignmentStrategy. The service doesn't know or care whether
 *     the strategy selects randomly, by proximity, or by workload.
 *
 * SOLID:
 *   SRP — DeliveryService only handles delivery management.
 *   OCP — New assignment strategies don't require changes to this class.
 *   DIP — Depends on DeliveryAssignmentStrategy (abstraction), not concrete strategies.
 *
 * WHY DeliveryService IS AN OBSERVER:
 *   Alternative: FoodDeliverySystem could call deliveryService.assignPartner()
 *   explicitly after each state transition. But that would:
 *     1. Couple the orchestrator to the delivery lifecycle details.
 *     2. Require the orchestrator to know WHEN to trigger assignment.
 *     3. Make adding new reactive services (analytics, etc.) require
 *        changes to the orchestrator.
 *   With Observer, the Order publishes events and any number of services
 *   can react independently.
 */
export declare class DeliveryService implements OrderObserver {
    private assignmentStrategy;
    private readonly partners;
    constructor(assignmentStrategy: DeliveryAssignmentStrategy);
    /** Register a delivery partner in the system. */
    addPartner(partner: DeliveryPartner): void;
    /** Get all currently available partners. */
    getAvailablePartners(): DeliveryPartner[];
    /**
     * Swap the assignment strategy at runtime.
     * Demonstrates that DeliveryService depends on the abstraction,
     * not a specific implementation.
     */
    setStrategy(strategy: DeliveryAssignmentStrategy): void;
    /**
     * Observer callback: react to order lifecycle events.
     *
     * When order becomes PREPARING, attempt to assign a delivery partner.
     * This is a natural trigger point — the restaurant has started cooking,
     * so it's time to find someone to deliver.
     */
    onOrderEvent(event: OrderEvent): void;
    /**
     * Select and assign a delivery partner to an order.
     *
     * This method delegates selection to the strategy and then calls
     * order.assignDeliveryPartner() which enforces the "only one partner"
     * invariant.
     */
    assignPartnerToOrder(order: Order): DeliveryPartner | null;
}
//# sourceMappingURL=DeliveryService.d.ts.map