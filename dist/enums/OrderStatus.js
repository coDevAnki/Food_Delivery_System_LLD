"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
/**
 * OrderStatus represents every valid state in an order's lifecycle.
 *
 * We use a plain enum rather than the State design pattern because:
 * - The number of states is small and stable.
 * - Transition logic is simple enough for guard checks inside Order methods.
 * - A full State pattern would add ~7 classes for minimal benefit at this scale.
 *
 * The Order class is responsible for enforcing valid transitions;
 * no external code should set the status directly.
 */
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PLACED"] = "PLACED";
    OrderStatus["ACCEPTED"] = "ACCEPTED";
    OrderStatus["PREPARING"] = "PREPARING";
    OrderStatus["READY_FOR_PICKUP"] = "READY_FOR_PICKUP";
    OrderStatus["PICKED_UP"] = "PICKED_UP";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
//# sourceMappingURL=OrderStatus.js.map