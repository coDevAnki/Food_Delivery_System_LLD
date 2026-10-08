import { PaymentMethod } from "../interfaces/PaymentMethod";
import { PaymentStatus } from "../enums/PaymentStatus";
import { PaymentType } from "../enums/PaymentType";
/**
 * CashPaymentMethod represents cash-on-delivery (postpaid).
 *
 * This is the most interesting PaymentMethod because it demonstrates
 * WHY we separate PaymentMethod (mechanism) from PaymentStatus (state):
 *
 *   - UPI/Card/Wallet → processPayment returns SUCCESS immediately
 *   - Cash → processPayment returns PENDING
 *
 * The payment stays PENDING until the delivery partner collects cash
 * and Payment.confirmPayment() is called.
 *
 * If we had used a simple boolean or a single enum for payment,
 * this nuance would be impossible to model cleanly.
 */
export declare class CashPaymentMethod implements PaymentMethod {
    getType(): PaymentType;
    processPayment(amount: number): PaymentStatus;
}
//# sourceMappingURL=CashPaymentMethod.d.ts.map