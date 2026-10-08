"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = void 0;
/**
 * PaymentStatus tracks the lifecycle of a payment, independent of the
 * payment mechanism (PaymentMethod).
 *
 * This separation is key:
 *   PaymentMethod = HOW you pay (UPI, Card, Cash, ...)
 *   PaymentStatus = WHERE the payment is in its lifecycle (PENDING → SUCCESS/FAILED)
 *
 * Example: Cash/POSTPAID starts as PENDING and becomes SUCCESS after collection.
 */
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["SUCCESS"] = "SUCCESS";
    PaymentStatus["FAILED"] = "FAILED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
//# sourceMappingURL=PaymentStatus.js.map