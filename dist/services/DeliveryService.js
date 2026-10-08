"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryService = void 0;
const OrderStatus_1 = require("../enums/OrderStatus");
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
class DeliveryService {
    constructor(assignmentStrategy) {
        this.assignmentStrategy = assignmentStrategy;
        this.partners = [];
    }
    /** Register a delivery partner in the system. */
    addPartner(partner) {
        this.partners.push(partner);
    }
    /** Get all currently available partners. */
    getAvailablePartners() {
        return this.partners.filter((p) => p.isAvailable());
    }
    /**
     * Swap the assignment strategy at runtime.
     * Demonstrates that DeliveryService depends on the abstraction,
     * not a specific implementation.
     */
    setStrategy(strategy) {
        this.assignmentStrategy = strategy;
    }
    /**
     * Observer callback: react to order lifecycle events.
     *
     * When order becomes PREPARING, attempt to assign a delivery partner.
     * This is a natural trigger point — the restaurant has started cooking,
     * so it's time to find someone to deliver.
     */
    onOrderEvent(event) {
        const { order, newStatus } = event;
        if (newStatus === OrderStatus_1.OrderStatus.PREPARING) {
            console.log(`  🚚 DeliveryService received event: Order #${order.id} is PREPARING. ` +
                `Attempting to assign a delivery partner...`);
            this.assignPartnerToOrder(order);
        }
    }
    /**
     * Select and assign a delivery partner to an order.
     *
     * This method delegates selection to the strategy and then calls
     * order.assignDeliveryPartner() which enforces the "only one partner"
     * invariant.
     */
    assignPartnerToOrder(order) {
        const availablePartners = this.getAvailablePartners();
        const selectedPartner = this.assignmentStrategy.selectPartner(availablePartners, order);
        if (!selectedPartner) {
            console.log(`  ⚠️  No available delivery partners for order #${order.id}`);
            return null;
        }
        // The Order enforces the invariant that only one partner can be assigned.
        order.assignDeliveryPartner(selectedPartner);
        console.log(`  ✅ Delivery partner "${selectedPartner.name}" assigned to order #${order.id}`);
        return selectedPartner;
    }
}
exports.DeliveryService = DeliveryService;
//# sourceMappingURL=DeliveryService.js.map