"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryPartner = void 0;
const DeliveryPartnerStatus_1 = require("../enums/DeliveryPartnerStatus");
/**
 * DeliveryPartner represents a delivery person in the system.
 *
 * WHY THIS CLASS EXISTS:
 *   Models delivery personnel with their availability status.
 *   DeliveryService manages a pool of these partners and uses a Strategy
 *   to select one for each order.
 *
 * RESPONSIBILITY:
 *   - Tracks own availability status (AVAILABLE / ASSIGNED / ON_DELIVERY)
 *   - Knows which order it's currently assigned to (by orderId, since
 *     the partner doesn't need the full Order object)
 *
 * RELATIONSHIPS:
 *   - Managed by DeliveryService (association — partner exists independently)
 *   - Referenced by Order (the Order knows which partner is assigned)
 *
 * SOLID:
 *   SRP — DeliveryPartner only models the partner entity.
 *   It does NOT decide which order to accept (that's DeliveryAssignmentStrategy).
 *   It does NOT manage the pool of partners (that's DeliveryService).
 */
class DeliveryPartner {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this._status = DeliveryPartnerStatus_1.DeliveryPartnerStatus.AVAILABLE;
        this._currentOrderId = null;
    }
    get status() {
        return this._status;
    }
    get currentOrderId() {
        return this._currentOrderId;
    }
    isAvailable() {
        return this._status === DeliveryPartnerStatus_1.DeliveryPartnerStatus.AVAILABLE;
    }
    assignToOrder(orderId) {
        if (!this.isAvailable()) {
            throw new Error(`Partner "${this.name}" is not available for assignment`);
        }
        this._status = DeliveryPartnerStatus_1.DeliveryPartnerStatus.ASSIGNED;
        this._currentOrderId = orderId;
    }
    startDelivery() {
        if (this._status !== DeliveryPartnerStatus_1.DeliveryPartnerStatus.ASSIGNED) {
            throw new Error(`Partner "${this.name}" must be ASSIGNED before starting delivery`);
        }
        this._status = DeliveryPartnerStatus_1.DeliveryPartnerStatus.ON_DELIVERY;
    }
    completeDelivery() {
        this._status = DeliveryPartnerStatus_1.DeliveryPartnerStatus.AVAILABLE;
        this._currentOrderId = null;
    }
}
exports.DeliveryPartner = DeliveryPartner;
//# sourceMappingURL=DeliveryPartner.js.map