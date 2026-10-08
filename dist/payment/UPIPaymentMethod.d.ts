import { PaymentMethod } from "../interfaces/PaymentMethod";
import { PaymentStatus } from "../enums/PaymentStatus";
import { PaymentType } from "../enums/PaymentType";
/**
 * UPIPaymentMethod processes payment via UPI.
 * Simulates immediate success (in reality, this would call a payment gateway).
 */
export declare class UPIPaymentMethod implements PaymentMethod {
    getType(): PaymentType;
    processPayment(amount: number): PaymentStatus;
}
//# sourceMappingURL=UPIPaymentMethod.d.ts.map