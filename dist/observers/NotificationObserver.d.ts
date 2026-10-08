import { OrderObserver, OrderEvent } from "../interfaces/OrderObserver";
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
export declare class NotificationObserver implements OrderObserver {
    onOrderEvent(event: OrderEvent): void;
}
//# sourceMappingURL=NotificationObserver.d.ts.map