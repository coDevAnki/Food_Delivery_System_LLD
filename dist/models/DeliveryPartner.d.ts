import { DeliveryPartnerStatus } from "../enums/DeliveryPartnerStatus";
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
export declare class DeliveryPartner {
    readonly id: string;
    readonly name: string;
    private _status;
    private _currentOrderId;
    constructor(id: string, name: string);
    get status(): DeliveryPartnerStatus;
    get currentOrderId(): string | null;
    isAvailable(): boolean;
    assignToOrder(orderId: string): void;
    startDelivery(): void;
    completeDelivery(): void;
}
//# sourceMappingURL=DeliveryPartner.d.ts.map