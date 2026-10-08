"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPIPaymentMethod = void 0;
const PaymentStatus_1 = require("../enums/PaymentStatus");
const PaymentType_1 = require("../enums/PaymentType");
/**
 * UPIPaymentMethod processes payment via UPI.
 * Simulates immediate success (in reality, this would call a payment gateway).
 */
class UPIPaymentMethod {
    getType() {
        return PaymentType_1.PaymentType.UPI;
    }
    processPayment(amount) {
        console.log(`  💳 Processing UPI payment of ₹${amount.toFixed(2)}...`);
        // In production: call UPI gateway, handle callbacks, etc.
        return PaymentStatus_1.PaymentStatus.SUCCESS;
    }
}
exports.UPIPaymentMethod = UPIPaymentMethod;
//# sourceMappingURL=UPIPaymentMethod.js.map