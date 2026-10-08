import { Order } from "./Order";
import { Payment } from "./Payment";
/**
 * Invoice is generated after order completion/payment.
 *
 * WHY THIS CLASS EXISTS:
 *   Provides a snapshot summary of a completed order for record-keeping.
 *   Separating Invoice from Order follows SRP: Order manages lifecycle,
 *   Invoice captures the finalized financial record.
 *
 * RESPONSIBILITY:
 *   - Captures order details, items, totals, and payment info at a point in time
 *   - Provides a formatted display method
 *
 * RELATIONSHIPS:
 *   - order: Association (references the completed Order)
 *   - payment: Association (references the Payment)
 */
export declare class Invoice {
    readonly id: string;
    readonly order: Order;
    readonly payment: Payment;
    readonly generatedAt: Date;
    constructor(id: string, order: Order, payment: Payment);
    getDetails(): string;
}
//# sourceMappingURL=Invoice.d.ts.map