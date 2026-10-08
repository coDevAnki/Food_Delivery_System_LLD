"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice = void 0;
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
class Invoice {
    constructor(id, order, payment) {
        this.id = id;
        this.order = order;
        this.payment = payment;
        this.generatedAt = new Date();
    }
    getDetails() {
        const lines = [
            `════════════════════════════════════════`,
            `  INVOICE: ${this.id}`,
            `════════════════════════════════════════`,
            `  Order:      ${this.order.id}`,
            `  Customer:   ${this.order.customer.name}`,
            `  Restaurant: ${this.order.restaurant.name}`,
            `  Date:       ${this.generatedAt.toLocaleString()}`,
            `────────────────────────────────────────`,
            `  Items:`,
        ];
        for (const item of this.order.orderItems) {
            lines.push(`    ${item.foodItem.name} × ${item.quantity}  ` +
                `@ ₹${item.priceAtPurchase.toFixed(2)} = ₹${item.getSubtotal().toFixed(2)}`);
        }
        lines.push(`────────────────────────────────────────`);
        lines.push(`  Total:      ₹${this.order.getTotal().toFixed(2)}`);
        lines.push(`  Payment:    ${this.payment.paymentMethod.getType()} — ${this.payment.status}`);
        if (this.order.deliveryPartner) {
            lines.push(`  Delivered by: ${this.order.deliveryPartner.name}`);
        }
        lines.push(`════════════════════════════════════════`);
        return lines.join("\n");
    }
}
exports.Invoice = Invoice;
//# sourceMappingURL=Invoice.js.map