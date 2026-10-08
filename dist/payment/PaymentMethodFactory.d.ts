import { PaymentMethod } from "../interfaces/PaymentMethod";
import { PaymentType } from "../enums/PaymentType";
/**
 * PaymentMethodFactory creates the appropriate PaymentMethod implementation
 * based on a PaymentType discriminator.
 *
 * WHY THIS CLASS EXISTS (Factory Pattern):
 *   Without the factory, the calling code would need to know about every
 *   concrete PaymentMethod class:
 *
 *     // Naive approach — caller must import and switch on every type
 *     let method: PaymentMethod;
 *     if (type === PaymentType.UPI) method = new UPIPaymentMethod();
 *     else if (type === PaymentType.CARD) method = new CardPaymentMethod();
 *     ...
 *
 *   This violates OCP because adding a new payment type forces changes
 *   everywhere orders are created.
 *
 *   With the factory:
 *     const method = PaymentMethodFactory.create(PaymentType.UPI);
 *
 *   The factory is the ONLY place that knows about concrete implementations.
 *   Adding a new payment type means:
 *     1. Create the new class (e.g., CryptoPaymentMethod)
 *     2. Add one case to the factory
 *     3. Zero changes to Payment, Order, or any calling code
 *
 * RESPONSIBILITY:
 *   Single responsibility: instantiate the correct PaymentMethod.
 *
 * SOLID:
 *   OCP — New payment types only require a new class + one factory case.
 *   DIP — Callers depend on PaymentMethod (interface), not on concrete classes.
 */
export declare class PaymentMethodFactory {
    static create(type: PaymentType): PaymentMethod;
}
//# sourceMappingURL=PaymentMethodFactory.d.ts.map