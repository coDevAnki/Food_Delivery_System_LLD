"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodFactory = void 0;
const PaymentType_1 = require("../enums/PaymentType");
const UPIPaymentMethod_1 = require("./UPIPaymentMethod");
const CardPaymentMethod_1 = require("./CardPaymentMethod");
const WalletPaymentMethod_1 = require("./WalletPaymentMethod");
const CashPaymentMethod_1 = require("./CashPaymentMethod");
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
class PaymentMethodFactory {
    static create(type) {
        switch (type) {
            case PaymentType_1.PaymentType.UPI:
                return new UPIPaymentMethod_1.UPIPaymentMethod();
            case PaymentType_1.PaymentType.CARD:
                return new CardPaymentMethod_1.CardPaymentMethod();
            case PaymentType_1.PaymentType.WALLET:
                return new WalletPaymentMethod_1.WalletPaymentMethod();
            case PaymentType_1.PaymentType.CASH:
                return new CashPaymentMethod_1.CashPaymentMethod();
            default:
                // TypeScript exhaustiveness check: if a new enum value is added
                // without updating this switch, the compiler catches it.
                const _exhaustive = type;
                throw new Error(`Unknown payment type: ${_exhaustive}`);
        }
    }
}
exports.PaymentMethodFactory = PaymentMethodFactory;
//# sourceMappingURL=PaymentMethodFactory.js.map