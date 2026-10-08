import { DeliveryPartner } from "../models/DeliveryPartner";
import { Order } from "../models/Order";
/**
 * DeliveryAssignmentStrategy is the Strategy interface.
 *
 * It decouples the POLICY of selecting a delivery partner from the
 * SERVICE that manages delivery partners.
 *
 * DeliveryService depends on this abstraction (DIP), so adding a
 * new assignment algorithm (e.g., "highest-rated partner first")
 * requires zero changes to DeliveryService (OCP).
 */
export interface DeliveryAssignmentStrategy {
    selectPartner(availablePartners: DeliveryPartner[], order: Order): DeliveryPartner | null;
}
//# sourceMappingURL=DeliveryAssignmentStrategy.d.ts.map