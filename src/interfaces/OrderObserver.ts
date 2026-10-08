import { Order } from "../models/Order";
import { OrderStatus } from "../enums/OrderStatus";

/**
 * OrderEvent is the payload published when an order transitions state.
 *
 * It carries enough context for any observer to react:
 * - The order itself (for accessing customer, restaurant, items, etc.)
 * - The previous and new status (so observers can filter events they care about)
 * - A timestamp
 *
 * This is a plain data object, not a class with behavior.
 */
export interface OrderEvent {
  readonly order: Order;
  readonly previousStatus: OrderStatus;
  readonly newStatus: OrderStatus;
  readonly timestamp: Date;
}

/**
 * OrderObserver is the Observer interface for the Observer pattern.
 *
 * Any service that needs to react to order lifecycle changes implements
 * this interface and subscribes to orders.
 *
 * This ensures Order does NOT know about DeliveryService, NotificationService,
 * or any other concrete service — it only knows about this abstraction.
 *
 * DIP in action: Order depends on OrderObserver (abstraction),
 * not on DeliveryService (concrete).
 */
export interface OrderObserver {
  onOrderEvent(event: OrderEvent): void;
}
