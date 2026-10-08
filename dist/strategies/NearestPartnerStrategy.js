"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NearestPartnerStrategy = void 0;
/**
 * NearestPartnerStrategy would select the delivery partner closest to
 * the restaurant. Since geolocation is out of scope, this is a stub
 * that simply selects the first available partner.
 *
 * The point is to show that:
 *   1. A new strategy can be added without changing DeliveryService (OCP).
 *   2. DeliveryService depends on DeliveryAssignmentStrategy (DIP),
 *      so swapping RandomAssignment for NearestPartner is a one-line change.
 *   3. All strategies are substitutable via the same interface (LSP).
 */
class NearestPartnerStrategy {
    selectPartner(availablePartners, _order) {
        if (availablePartners.length === 0) {
            return null;
        }
        // Stub: In production, sort by distance to order.restaurant.location
        // and return the closest one.
        console.log("  📍 (NearestPartnerStrategy: using stub — selecting first available)");
        return availablePartners[0];
    }
}
exports.NearestPartnerStrategy = NearestPartnerStrategy;
//# sourceMappingURL=NearestPartnerStrategy.js.map