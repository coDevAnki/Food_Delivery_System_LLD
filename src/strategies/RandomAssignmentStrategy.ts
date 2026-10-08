import { DeliveryAssignmentStrategy } from "../interfaces/DeliveryAssignmentStrategy";
import { DeliveryPartner } from "../models/DeliveryPartner";
import { Order } from "../models/Order";

/**
 * RandomAssignmentStrategy selects a random available delivery partner.
 *
 * This is the simplest concrete strategy — it demonstrates the pattern
 * without requiring geolocation or workload tracking infrastructure.
 *
 * In an interview, you'd implement this first, then mention that
 * NearestPartnerStrategy or LowestWorkloadStrategy would follow
 * the same interface.
 */
export class RandomAssignmentStrategy implements DeliveryAssignmentStrategy {
  selectPartner(
    availablePartners: DeliveryPartner[],
    _order: Order
  ): DeliveryPartner | null {
    if (availablePartners.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * availablePartners.length);
    return availablePartners[randomIndex];
  }
}
