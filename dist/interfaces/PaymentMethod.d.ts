import { PaymentStatus } from "../enums/PaymentStatus";
import { PaymentType } from "../enums/PaymentType";
/**
 * PaymentMethod is the abstraction for different payment mechanisms.
 *
 * Each concrete implementation (UPI, Card, Wallet, Cash) encapsulates
 * HOW payment is processed, while Payment tracks the resulting state.
 *
 * processPayment() returns a PaymentStatus because different methods
 * have different immediate outcomes:
 *   - UPI/Card/Wallet → SUCCESS (or FAILED)
 *   - Cash → PENDING (collected on delivery)
 *
 * This is the product created by PaymentMethodFactory (Factory pattern).
 */
export interface PaymentMethod {
    getType(): PaymentType;
    processPayment(amount: number): PaymentStatus;
}
//# sourceMappingURL=PaymentMethod.d.ts.map