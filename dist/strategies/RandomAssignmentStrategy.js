"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomAssignmentStrategy = void 0;
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
class RandomAssignmentStrategy {
    selectPartner(availablePartners, _order) {
        if (availablePartners.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * availablePartners.length);
        return availablePartners[randomIndex];
    }
}
exports.RandomAssignmentStrategy = RandomAssignmentStrategy;
//# sourceMappingURL=RandomAssignmentStrategy.js.map