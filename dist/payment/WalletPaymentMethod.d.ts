import { PaymentMethod } from "../interfaces/PaymentMethod";
import { PaymentStatus } from "../enums/PaymentStatus";
import { PaymentType } from "../enums/PaymentType";
/**
 * WalletPaymentMethod processes payment via digital wallet.
 * Simulates immediate success.
 */
export declare class WalletPaymentMethod implements PaymentMethod {
    getType(): PaymentType;
    processPayment(amount: number): PaymentStatus;
}
//# sourceMappingURL=WalletPaymentMethod.d.ts.map