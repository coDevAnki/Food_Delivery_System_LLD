"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodDeliverySystem = void 0;
const Payment_1 = require("../models/Payment");
const Invoice_1 = require("../models/Invoice");
const PaymentMethodFactory_1 = require("../payment/PaymentMethodFactory");
const PaymentStatus_1 = require("../enums/PaymentStatus");
const OrderStatus_1 = require("../enums/OrderStatus");
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
class FoodDeliverySystem {
    constructor(deliveryService) {
        this.deliveryService = deliveryService;
        this.restaurants = [];
        this.customers = [];
        this.orders = [];
        this.invoices = [];
        this.observers = [];
        this.invoiceCounter = 0;
        this.paymentCounter = 0;
        // DeliveryService is itself an observer; register it
        this.observers.push(deliveryService);
    }
    /** Register an additional observer that all new orders will subscribe to. */
    addObserver(observer) {
        this.observers.push(observer);
    }
    registerRestaurant(restaurant) {
        this.restaurants.push(restaurant);
    }
    registerCustomer(customer) {
        this.customers.push(customer);
    }
    registerDeliveryPartner(partner) {
        this.deliveryService.addPartner(partner);
    }
    /**
     * Place an order and wire up all observers.
     * The order is created by the Customer (domain-driven),
     * then the system subscribes all registered observers.
     */
    placeOrder(order) {
        // Subscribe all registered observers to this order
        for (const observer of this.observers) {
            order.subscribe(observer);
        }
        this.orders.push(order);
    }
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
    processPayment(order, paymentType) {
        this.paymentCounter++;
        const paymentMethod = PaymentMethodFactory_1.PaymentMethodFactory.create(paymentType);
        const payment = new Payment_1.Payment(`PAY-${this.paymentCounter}`, order, order.getTotal(), paymentMethod);
        payment.processPayment();
        order.setPayment(payment);
        return payment;
    }
    /**
     * Generate an invoice for a completed order.
     * Only generates if the order is delivered and payment is successful.
     */
    generateInvoice(order) {
        if (order.status !== OrderStatus_1.OrderStatus.DELIVERED) {
            throw new Error("Invoice can only be generated for delivered orders");
        }
        if (!order.payment) {
            throw new Error("Invoice requires a payment to be associated");
        }
        if (order.payment.status !== PaymentStatus_1.PaymentStatus.SUCCESS) {
            throw new Error(`Invoice requires successful payment. Current status: ${order.payment.status}`);
        }
        this.invoiceCounter++;
        const invoice = new Invoice_1.Invoice(`INV-${this.invoiceCounter}`, order, order.payment);
        this.invoices.push(invoice);
        return invoice;
    }
    getOrders() {
        return this.orders;
    }
    getInvoices() {
        return this.invoices;
    }
}
exports.FoodDeliverySystem = FoodDeliverySystem;
//# sourceMappingURL=FoodDeliverySystem.js.map