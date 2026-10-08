"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationObserver = void 0;
const OrderStatus_1 = require("../enums/OrderStatus");
/**
 * NotificationObserver listens to order events and sends notifications.
 *
 * WHY THIS CLASS EXISTS:
 *   Demonstrates the Observer pattern's key benefit: Order doesn't know
 *   about notifications. It just publishes events. This observer
 *   independently decides which events to act on.
 *
 * In production, this would integrate with SMS/email/push notification services.
 * Here it just logs to console to demonstrate the mechanism.
 *
 * SOLID:
 *   SRP — Notification logic is here, not in Order.
 *   OCP — Adding this observer required zero changes to Order.
 */
class NotificationObserver {
    onOrderEvent(event) {
        const { order, newStatus } = event;
        switch (newStatus) {
            case OrderStatus_1.OrderStatus.ACCEPTED:
                console.log(`  📱 Notification → ${order.customer.name}: ` +
                    `Your order #${order.id} has been accepted by ${order.restaurant.name}!`);
                break;
            case OrderStatus_1.OrderStatus.PREPARING:
                console.log(`  📱 Notification → ${order.customer.name}: ` +
                    `Your order #${order.id} is being prepared!`);
                break;
            case OrderStatus_1.OrderStatus.READY_FOR_PICKUP:
                console.log(`  📱 Notification → ${order.customer.name}: ` +
                    `Your order #${order.id} is ready for pickup!`);
                break;
            case OrderStatus_1.OrderStatus.PICKED_UP:
                console.log(`  📱 Notification → ${order.customer.name}: ` +
                    `Your order #${order.id} is on its way!`);
                break;
            case OrderStatus_1.OrderStatus.DELIVERED:
                console.log(`  📱 Notification → ${order.customer.name}: ` +
                    `Your order #${order.id} has been delivered. Enjoy your meal!`);
                break;
            case OrderStatus_1.OrderStatus.CANCELLED:
                console.log(`  📱 Notification → ${order.customer.name}: ` +
                    `Your order #${order.id} has been cancelled.`);
                break;
        }
    }
}
exports.NotificationObserver = NotificationObserver;
//# sourceMappingURL=NotificationObserver.js.map