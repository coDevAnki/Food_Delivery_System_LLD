import { PaymentMethod } from "../interfaces/PaymentMethod";
import { PaymentStatus } from "../enums/PaymentStatus";
import { PaymentType } from "../enums/PaymentType";

/**
 * CardPaymentMethod processes payment via credit/debit card.
 * Simulates immediate success.
 */
export class CardPaymentMethod implements PaymentMethod {
  getType(): PaymentType {
    return PaymentType.CARD;
  }

  processPayment(amount: number): PaymentStatus {
    console.log(`  💳 Processing Card payment of ₹${amount.toFixed(2)}...`);
    // In production: tokenize card, call payment processor, handle 3DS, etc.
    return PaymentStatus.SUCCESS;
  }
}
