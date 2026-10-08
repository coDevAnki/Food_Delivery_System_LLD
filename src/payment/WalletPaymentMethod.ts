import { PaymentMethod } from "../interfaces/PaymentMethod";
import { PaymentStatus } from "../enums/PaymentStatus";
import { PaymentType } from "../enums/PaymentType";

/**
 * WalletPaymentMethod processes payment via digital wallet.
 * Simulates immediate success.
 */
export class WalletPaymentMethod implements PaymentMethod {
  getType(): PaymentType {
    return PaymentType.WALLET;
  }

  processPayment(amount: number): PaymentStatus {
    console.log(`  💳 Processing Wallet payment of ₹${amount.toFixed(2)}...`);
    // In production: check wallet balance, debit wallet, etc.
    return PaymentStatus.SUCCESS;
  }
}
