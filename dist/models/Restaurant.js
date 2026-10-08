"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restaurant = void 0;
const Menu_1 = require("./Menu");
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
class Restaurant {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.menu = new Menu_1.Menu();
    }
    /** Restaurant accepts a placed order. */
    acceptOrder(order) {
        this.validateOrderBelongsToRestaurant(order);
        order.accept();
    }
    /** Restaurant starts preparing the order. */
    startPreparingOrder(order) {
        this.validateOrderBelongsToRestaurant(order);
        order.startPreparing();
    }
    /** Restaurant marks the order as ready for pickup. */
    markOrderReadyForPickup(order) {
        this.validateOrderBelongsToRestaurant(order);
        order.markReadyForPickup();
    }
    validateOrderBelongsToRestaurant(order) {
        if (order.restaurant !== this) {
            throw new Error(`Order "${order.id}" does not belong to restaurant "${this.name}"`);
        }
    }
}
exports.Restaurant = Restaurant;
//# sourceMappingURL=Restaurant.js.map