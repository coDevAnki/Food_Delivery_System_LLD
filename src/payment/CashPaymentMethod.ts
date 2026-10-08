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
export class CashPaymentMethod implements PaymentMethod {
  getType(): PaymentType {
    return PaymentType.CASH;
  }

  processPayment(amount: number): PaymentStatus {
    console.log(
      `  💵 Cash on delivery selected for ₹${amount.toFixed(2)}. ` +
      `Payment will be collected upon delivery.`
    );
    // Cash is postpaid — payment is pending until collected
    return PaymentStatus.PENDING;
  }
}
