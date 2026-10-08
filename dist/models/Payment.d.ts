import { PaymentStatus } from "../enums/PaymentStatus";
import { PaymentMethod } from "../interfaces/PaymentMethod";
import { Order } from "./Order";
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
export declare class Payment {
    readonly id: string;
    readonly order: Order;
    readonly amount: number;
    readonly paymentMethod: PaymentMethod;
    private _status;
    constructor(id: string, order: Order, amount: number, paymentMethod: PaymentMethod);
    get status(): PaymentStatus;
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
    processPayment(): void;
    /**
     * For postpaid methods (e.g., Cash), confirm collection after delivery.
     * This transitions a PENDING payment to SUCCESS.
     */
    confirmPayment(): void;
}
//# sourceMappingURL=Payment.d.ts.map