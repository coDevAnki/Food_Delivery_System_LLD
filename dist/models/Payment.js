"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const PaymentStatus_1 = require("../enums/PaymentStatus");
/**
 * Payment represents a payment for an order and tracks its state.
 *
 * WHY THIS CLASS EXISTS:
 *   Payment separates the CONCEPT of "this order has been paid" from
 *   the MECHANISM of "how was it paid." This is a critical distinction:
 *
 *     Payment  = the record (amount, status, association to order)
 *     PaymentMethod = the behavior (how to process the payment)
 *
 *   Without this separation, you'd need a switch/if-chain inside Payment
 *   every time a new payment type is added — violating OCP.
 *
 * RESPONSIBILITY:
 *   - Associates a payment method with an order
 *   - Tracks payment status (PENDING / SUCCESS / FAILED)
 *   - Delegates actual processing to the PaymentMethod
 *
 * RELATIONSHIPS:
 *   - order: Association (Order exists independently)
 *   - paymentMethod: Composition (the method is part of this payment)
 *
 * SOLID:
 *   SRP — Payment tracks state; PaymentMethod handles processing.
 *   OCP — Adding a new payment type doesn't change Payment at all.
 *   DIP — Payment depends on PaymentMethod interface, not UPI/Card/etc.
 *
 * DESIGN PATTERN:
 *   PaymentMethod is the product of the Factory pattern.
 *   Payment USES the product but doesn't create it — that's PaymentMethodFactory's job.
 */
class Payment {
    constructor(id, order, amount, paymentMethod) {
        this.id = id;
        this.order = order;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this._status = PaymentStatus_1.PaymentStatus.PENDING;
    }
    get status() {
        return this._status;
    }
    /**
     * Process the payment by delegating to the PaymentMethod.
     *
     * The key insight: different methods return different statuses.
     *   - UPI/Card/Wallet: SUCCESS immediately
     *   - Cash: PENDING (to be collected on delivery)
     *
     * Payment doesn't know or care which method it is — it just stores
     * whatever status the method returns. This is polymorphism in action.
     */
    processPayment() {
        if (this._status === PaymentStatus_1.PaymentStatus.SUCCESS) {
            throw new Error("Payment has already been processed successfully");
        }
        this._status = this.paymentMethod.processPayment(this.amount);
    }
    /**
     * For postpaid methods (e.g., Cash), confirm collection after delivery.
     * This transitions a PENDING payment to SUCCESS.
     */
    confirmPayment() {
        if (this._status !== PaymentStatus_1.PaymentStatus.PENDING) {
            throw new Error(`Cannot confirm payment in status "${this._status}". ` +
                `Only PENDING payments can be confirmed.`);
        }
        this._status = PaymentStatus_1.PaymentStatus.SUCCESS;
    }
}
exports.Payment = Payment;
//# sourceMappingURL=Payment.js.map