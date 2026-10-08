"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardPaymentMethod = void 0;
const PaymentStatus_1 = require("../enums/PaymentStatus");
const PaymentType_1 = require("../enums/PaymentType");
/**
 * CardPaymentMethod processes payment via credit/debit card.
 * Simulates immediate success.
 */
class CardPaymentMethod {
    getType() {
        return PaymentType_1.PaymentType.CARD;
    }
    processPayment(amount) {
        console.log(`  💳 Processing Card payment of ₹${amount.toFixed(2)}...`);
        // In production: tokenize card, call payment processor, handle 3DS, etc.
        return PaymentStatus_1.PaymentStatus.SUCCESS;
    }
}
exports.CardPaymentMethod = CardPaymentMethod;
//# sourceMappingURL=CardPaymentMethod.js.map