/**
 * DeliveryPartnerStatus tracks whether a delivery partner is
 * free to accept new orders or currently assigned/delivering.
 */
export enum DeliveryPartnerStatus {
  AVAILABLE   = "AVAILABLE",
  ASSIGNED    = "ASSIGNED",
  ON_DELIVERY = "ON_DELIVERY",
}
