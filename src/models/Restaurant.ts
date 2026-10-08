import { Menu } from "./Menu";
import { Order } from "./Order";

/**
 * Restaurant represents a food establishment with a menu.
 *
 * WHY THIS CLASS EXISTS:
 *   Models the restaurant entity and provides restaurant-side
 *   order operations (accept, prepare, mark ready).
 *
 * RESPONSIBILITY:
 *   - Owns its Menu (composition)
 *   - Provides restaurant-side order lifecycle methods
 *
 * WHAT RESTAURANT DOES NOT DO:
 *   - Process payments (that's Payment + PaymentMethod)
 *   - Select delivery partners (that's DeliveryService + Strategy)
 *   - Manage global delivery (that's FoodDeliverySystem)
 *
 *   These boundaries are critical for SRP. In a naive design,
 *   Restaurant becomes a God object that does everything.
 *
 * RELATIONSHIPS:
 *   - menu: Composition (Menu cannot exist without its Restaurant)
 *   - The restaurant-side methods take an Order parameter rather than
 *     owning orders, because an Order belongs to the Order domain,
 *     not the Restaurant domain.
 *
 * SOLID:
 *   SRP — Restaurant handles restaurant-level concerns only.
 */
export class Restaurant {
  public readonly menu: Menu;

  constructor(
    public readonly id: string,
    public readonly name: string
  ) {
    this.menu = new Menu();
  }

  /** Restaurant accepts a placed order. */
  acceptOrder(order: Order): void {
    this.validateOrderBelongsToRestaurant(order);
    order.accept();
  }

  /** Restaurant starts preparing the order. */
  startPreparingOrder(order: Order): void {
    this.validateOrderBelongsToRestaurant(order);
    order.startPreparing();
  }

  /** Restaurant marks the order as ready for pickup. */
  markOrderReadyForPickup(order: Order): void {
    this.validateOrderBelongsToRestaurant(order);
    order.markReadyForPickup();
  }

  private validateOrderBelongsToRestaurant(order: Order): void {
    if (order.restaurant !== this) {
      throw new Error(
        `Order "${order.id}" does not belong to restaurant "${this.name}"`
      );
    }
  }
}
