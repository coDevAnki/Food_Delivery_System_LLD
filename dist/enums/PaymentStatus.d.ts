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
export declare enum PaymentStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}
//# sourceMappingURL=PaymentStatus.d.ts.map