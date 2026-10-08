"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletPaymentMethod = void 0;
const PaymentStatus_1 = require("../enums/PaymentStatus");
const PaymentType_1 = require("../enums/PaymentType");
/**
 * WalletPaymentMethod processes payment via digital wallet.
 * Simulates immediate success.
 */
class WalletPaymentMethod {
    getType() {
        return PaymentType_1.PaymentType.WALLET;
    }
    processPayment(amount) {
        console.log(`  💳 Processing Wallet payment of ₹${amount.toFixed(2)}...`);
        // In production: check wallet balance, debit wallet, etc.
        return PaymentStatus_1.PaymentStatus.SUCCESS;
    }
}
exports.WalletPaymentMethod = WalletPaymentMethod;
//# sourceMappingURL=WalletPaymentMethod.js.map