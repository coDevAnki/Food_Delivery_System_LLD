"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashPaymentMethod = void 0;
const PaymentStatus_1 = require("../enums/PaymentStatus");
const PaymentType_1 = require("../enums/PaymentType");
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
class CashPaymentMethod {
    getType() {
        return PaymentType_1.PaymentType.CASH;
    }
    processPayment(amount) {
        console.log(`  💵 Cash on delivery selected for ₹${amount.toFixed(2)}. ` +
            `Payment will be collected upon delivery.`);
        // Cash is postpaid — payment is pending until collected
        return PaymentStatus_1.PaymentStatus.PENDING;
    }
}
exports.CashPaymentMethod = CashPaymentMethod;
//# sourceMappingURL=CashPaymentMethod.js.map