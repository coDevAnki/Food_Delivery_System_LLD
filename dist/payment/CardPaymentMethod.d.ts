import { PaymentMethod } from "../interfaces/PaymentMethod";
import { PaymentStatus } from "../enums/PaymentStatus";
import { PaymentType } from "../enums/PaymentType";
/**
 * CardPaymentMethod processes payment via credit/debit card.
 * Simulates immediate success.
 */
export declare class CardPaymentMethod implements PaymentMethod {
    getType(): PaymentType;
    processPayment(amount: number): PaymentStatus;
}
//# sourceMappingURL=CardPaymentMethod.d.ts.map