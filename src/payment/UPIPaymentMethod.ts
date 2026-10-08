import { PaymentMethod } from "../interfaces/PaymentMethod";
import { PaymentStatus } from "../enums/PaymentStatus";
import { PaymentType } from "../enums/PaymentType";

/**
 * UPIPaymentMethod processes payment via UPI.
 * Simulates immediate success (in reality, this would call a payment gateway).
 */
export class UPIPaymentMethod implements PaymentMethod {
  getType(): PaymentType {
    return PaymentType.UPI;
  }

  processPayment(amount: number): PaymentStatus {
    console.log(`  💳 Processing UPI payment of ₹${amount.toFixed(2)}...`);
    // In production: call UPI gateway, handle callbacks, etc.
    return PaymentStatus.SUCCESS;
  }
}
