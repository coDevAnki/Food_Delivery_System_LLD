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
export class DeliveryPartner {
  private _status: DeliveryPartnerStatus = DeliveryPartnerStatus.AVAILABLE;
  private _currentOrderId: string | null = null;

  constructor(
    public readonly id: string,
    public readonly name: string
  ) {}

  get status(): DeliveryPartnerStatus {
    return this._status;
  }

  get currentOrderId(): string | null {
    return this._currentOrderId;
  }

  isAvailable(): boolean {
    return this._status === DeliveryPartnerStatus.AVAILABLE;
  }

  assignToOrder(orderId: string): void {
    if (!this.isAvailable()) {
      throw new Error(`Partner "${this.name}" is not available for assignment`);
    }
    this._status = DeliveryPartnerStatus.ASSIGNED;
    this._currentOrderId = orderId;
  }

  startDelivery(): void {
    if (this._status !== DeliveryPartnerStatus.ASSIGNED) {
      throw new Error(`Partner "${this.name}" must be ASSIGNED before starting delivery`);
    }
    this._status = DeliveryPartnerStatus.ON_DELIVERY;
  }

  completeDelivery(): void {
    this._status = DeliveryPartnerStatus.AVAILABLE;
    this._currentOrderId = null;
  }
}
