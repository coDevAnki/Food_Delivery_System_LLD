import { Customer } from "../models/Customer";
import { Restaurant } from "../models/Restaurant";
import { DeliveryPartner } from "../models/DeliveryPartner";
import { Order } from "../models/Order";
import { Payment } from "../models/Payment";
import { Invoice } from "../models/Invoice";
import { DeliveryService } from "./DeliveryService";
import { PaymentType } from "../enums/PaymentType";
import { OrderObserver } from "../interfaces/OrderObserver";
/**
 * FoodDeliverySystem is the composition root / orchestration layer.
 *
 * WHY THIS CLASS EXISTS:
 *   It wires together the major components of the system and provides
 *   high-level operations. Think of it as the application's entry point
 *   that knows HOW to compose the pieces, but delegates actual work
 *   to the appropriate domain objects and services.
 *
 * WHAT IT IS NOT:
 *   A God object. It does NOT:
 *     - Calculate prices (Order/OrderItem do that)
 *     - Manage order state (Order does that)
 *     - Select delivery partners (DeliveryService + Strategy do that)
 *     - Process payments (Payment + PaymentMethod do that)
 *
 * RESPONSIBILITY:
 *   1. Registers restaurants, customers, delivery partners
 *   2. Wires observers to orders
 *   3. Provides high-level operations (processPayment, generateInvoice)
 *      that coordinate across domain boundaries
 *
 * RELATIONSHIPS:
 *   - Knows about all major entities (it's the composition root)
 *   - Delegates to DeliveryService for delivery concerns
 *   - Delegates to PaymentMethodFactory for payment creation
 *
 * SOLID:
 *   SRP — Orchestration only; real logic lives in domain objects.
 */
export declare class FoodDeliverySystem {
    private readonly deliveryService;
    private readonly restaurants;
    private readonly customers;
    private readonly orders;
    private readonly invoices;
    private readonly observers;
    private invoiceCounter;
    private paymentCounter;
    constructor(deliveryService: DeliveryService);
    /** Register an additional observer that all new orders will subscribe to. */
    addObserver(observer: OrderObserver): void;
    registerRestaurant(restaurant: Restaurant): void;
    registerCustomer(customer: Customer): void;
    registerDeliveryPartner(partner: DeliveryPartner): void;
    /**
     * Place an order and wire up all observers.
     * The order is created by the Customer (domain-driven),
     * then the system subscribes all registered observers.
     */
    placeOrder(order: Order): void;
    /**
     * Create and process a payment for an order.
     *
     * This method coordinates between:
     *   - PaymentMethodFactory (creates the right PaymentMethod)
     *   - Payment (processes via the method)
     *   - Order (associates the payment)
     *
     * This coordination logic lives here (not in Order) because
     * payment involves multiple components that Order shouldn't know about.
     */
    processPayment(order: Order, paymentType: PaymentType): Payment;
    /**
     * Generate an invoice for a completed order.
     * Only generates if the order is delivered and payment is successful.
     */
    generateInvoice(order: Order): Invoice;
    getOrders(): ReadonlyArray<Order>;
    getInvoices(): ReadonlyArray<Invoice>;
}
//# sourceMappingURL=FoodDeliverySystem.d.ts.map