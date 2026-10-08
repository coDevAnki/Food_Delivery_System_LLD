/**
 * ═══════════════════════════════════════════════════════════════════
 *  FOOD DELIVERY ORDERING SYSTEM — Complete Demonstration
 * ═══════════════════════════════════════════════════════════════════
 *
 * This file demonstrates the complete flow of the system:
 *   1. Setup (restaurants, menus, customers, delivery partners)
 *   2. Order creation and item addition
 *   3. Price snapshot preservation
 *   4. Order lifecycle with observer notifications
 *   5. Delivery partner assignment via strategy
 *   6. Payment processing (prepaid and postpaid)
 *   7. Invoice generation
 *   8. Invalid state transition rejection
 *   9. Concurrency guard demonstration
 */

import { Customer } from "./models/Customer";
import { Restaurant } from "./models/Restaurant";
import { FoodItem } from "./models/FoodItem";
import { DeliveryPartner } from "./models/DeliveryPartner";
import { DeliveryService } from "./services/DeliveryService";
import { FoodDeliverySystem } from "./services/FoodDeliverySystem";
import { RandomAssignmentStrategy } from "./strategies/RandomAssignmentStrategy";
import { NearestPartnerStrategy } from "./strategies/NearestPartnerStrategy";
import { NotificationObserver } from "./observers/NotificationObserver";
import { PaymentType } from "./enums/PaymentType";

// ═══════════════════════════════════════════════════════════════════
// Helper
// ═══════════════════════════════════════════════════════════════════

function section(title: string): void {
  console.log();
  console.log(`${"═".repeat(60)}`);
  console.log(`  ${title}`);
  console.log(`${"═".repeat(60)}`);
}

function step(description: string): void {
  console.log();
  console.log(`▸ ${description}`);
  console.log(`${"─".repeat(60)}`);
}

// ═══════════════════════════════════════════════════════════════════
// DEMO 1: Complete Happy-Path Flow (UPI Payment)
// ═══════════════════════════════════════════════════════════════════

function demoHappyPath(): void {
  section("DEMO 1: Complete Happy-Path Flow (UPI Payment)");

  // ── Step 1: Create Restaurant ──
  step("1. Create a restaurant");
  const restaurant = new Restaurant("R1", "Spice Garden");
  console.log(`  Created restaurant: ${restaurant.name}`);

  // ── Step 2–3: Create menu and add food items ──
  step("2–3. Add food items to the menu");
  const butterChicken = new FoodItem("F1", "Butter Chicken", "Main Course", 350);
  const naan = new FoodItem("F2", "Garlic Naan", "Bread", 60);
  const biryani = new FoodItem("F3", "Hyderabadi Biryani", "Main Course", 280);
  const lassi = new FoodItem("F4", "Mango Lassi", "Beverage", 90);

  restaurant.menu.addItem(butterChicken);
  restaurant.menu.addItem(naan);
  restaurant.menu.addItem(biryani);
  restaurant.menu.addItem(lassi);

  console.log("  Menu:");
  for (const item of restaurant.menu.getAvailableItems()) {
    console.log(`    • ${item.name} (${item.category}) — ₹${item.price}`);
  }

  // ── Step 4: Create customer ──
  step("4. Create a customer");
  const customer = new Customer("C1", "Rahul Sharma", "rahul@email.com");
  console.log(`  Created customer: ${customer.name}`);

  // ── Setup: Create delivery partners ──
  step("Setup: Create delivery partners");
  const dp1 = new DeliveryPartner("DP1", "Amit Kumar");
  const dp2 = new DeliveryPartner("DP2", "Priya Singh");
  const dp3 = new DeliveryPartner("DP3", "Ravi Patel");
  console.log(`  Registered partners: ${dp1.name}, ${dp2.name}, ${dp3.name}`);

  // ── Setup: Wire the system ──
  step("Setup: Wire the system (composition root)");
  const strategy = new RandomAssignmentStrategy();
  const deliveryService = new DeliveryService(strategy);
  const system = new FoodDeliverySystem(deliveryService);

  // Register entities
  system.registerRestaurant(restaurant);
  system.registerCustomer(customer);
  system.registerDeliveryPartner(dp1);
  system.registerDeliveryPartner(dp2);
  system.registerDeliveryPartner(dp3);

  // Add notification observer
  const notificationObserver = new NotificationObserver();
  system.addObserver(notificationObserver);

  console.log("  System wired: DeliveryService + NotificationObserver registered");

  // ── Step 5–6: Customer creates order and adds items ──
  step("5–6. Customer creates order and adds items with quantities");
  const order = customer.createOrder(restaurant);
  system.placeOrder(order);

  order.addItem(butterChicken, 2);  // 2 × ₹350 = ₹700
  order.addItem(naan, 4);           // 4 × ₹60  = ₹240
  order.addItem(lassi, 2);          // 2 × ₹90  = ₹180

  console.log(`  Order #${order.id} items:`);
  for (const item of order.orderItems) {
    console.log(
      `    ${item.foodItem.name} × ${item.quantity} ` +
      `@ ₹${item.priceAtPurchase} = ₹${item.getSubtotal()}`
    );
  }

  // ── Step 7: Show calculated order total ──
  step("7. Show calculated order total");
  console.log(`  Order total: ₹${order.getTotal()}`);

  // ── Demonstrate price snapshot preservation ──
  step("IMPORTANT: Price snapshot preservation");
  console.log(`  Current menu price of Butter Chicken: ₹${butterChicken.price}`);
  butterChicken.updatePrice(400);
  console.log(`  Restaurant raised price to: ₹${butterChicken.price}`);
  console.log(`  Order still shows: ₹${order.orderItems[0].priceAtPurchase} (snapshotted)`);
  console.log(`  Order total unchanged: ₹${order.getTotal()}`);

  // ── Step 8: Restaurant accepts order ──
  step("8. Restaurant accepts the order");
  restaurant.acceptOrder(order);
  console.log(`  Order status: ${order.status}`);

  // ── Step 9–12: Order moves to PREPARING → Observer fires → Delivery assignment ──
  step("9–12. Order → PREPARING → Observer fires → Delivery partner assigned");
  console.log("  (Watch the observer and delivery service messages below)");
  restaurant.startPreparingOrder(order);
  console.log(`  Order status: ${order.status}`);
  console.log(
    `  Assigned partner: ${order.deliveryPartner?.name ?? "none"}`
  );

  // ── Step 14: Order becomes READY_FOR_PICKUP ──
  step("14. Order becomes READY_FOR_PICKUP");
  restaurant.markOrderReadyForPickup(order);
  console.log(`  Order status: ${order.status}`);

  // ── Step 15: Partner picks up order ──
  step("15. Delivery partner picks up the order");
  order.deliveryPartner!.startDelivery();
  order.pickUp();
  console.log(`  Order status: ${order.status}`);

  // ── Step 16: Order becomes DELIVERED ──
  step("16. Order is delivered");
  order.deliver();
  order.deliveryPartner!.completeDelivery();
  console.log(`  Order status: ${order.status}`);

  // ── Step 17: Payment is processed ──
  step("17. Process payment (UPI)");
  const payment = system.processPayment(order, PaymentType.UPI);
  console.log(`  Payment status: ${payment.status}`);

  // ── Step 18: Invoice is generated ──
  step("18. Generate invoice");
  const invoice = system.generateInvoice(order);
  console.log(invoice.getDetails());
}

// ═══════════════════════════════════════════════════════════════════
// DEMO 2: Cash on Delivery (Postpaid) Flow
// ═══════════════════════════════════════════════════════════════════

function demoCashOnDelivery(): void {
  section("DEMO 2: Cash on Delivery (Postpaid) Flow");

  const restaurant = new Restaurant("R2", "Pizza Palace");
  const pizza = new FoodItem("F10", "Margherita Pizza", "Pizza", 250);
  restaurant.menu.addItem(pizza);

  const customer = new Customer("C2", "Anita Desai", "anita@email.com");
  const dp = new DeliveryPartner("DP10", "Suresh Yadav");

  const deliveryService = new DeliveryService(new NearestPartnerStrategy());
  const system = new FoodDeliverySystem(deliveryService);
  system.registerDeliveryPartner(dp);

  const order = customer.createOrder(restaurant);
  system.placeOrder(order);
  order.addItem(pizza, 3);

  step("Process Cash payment (postpaid)");
  const payment = system.processPayment(order, PaymentType.CASH);
  console.log(`  Payment type: ${payment.paymentMethod.getType()}`);
  console.log(`  Payment status after processPayment: ${payment.status}`);
  console.log(`  ↑ Notice: PENDING, not SUCCESS — cash hasn't been collected yet`);

  // Move order through lifecycle
  restaurant.acceptOrder(order);
  restaurant.startPreparingOrder(order);
  restaurant.markOrderReadyForPickup(order);
  order.pickUp();
  order.deliver();

  step("Cash collected upon delivery → confirm payment");
  payment.confirmPayment();
  console.log(`  Payment status after confirmPayment: ${payment.status}`);

  step("Now invoice can be generated");
  const invoice = system.generateInvoice(order);
  console.log(invoice.getDetails());
}

// ═══════════════════════════════════════════════════════════════════
// DEMO 3: Invalid State Transitions
// ═══════════════════════════════════════════════════════════════════

function demoInvalidTransitions(): void {
  section("DEMO 3: Invalid State Transitions — Domain Model Rejects Them");

  const restaurant = new Restaurant("R3", "Taco Town");
  const taco = new FoodItem("F20", "Fish Taco", "Taco", 180);
  restaurant.menu.addItem(taco);
  const customer = new Customer("C3", "Vikram Joshi", "vikram@email.com");

  const deliveryService = new DeliveryService(new RandomAssignmentStrategy());
  const system = new FoodDeliverySystem(deliveryService);

  const order = customer.createOrder(restaurant);
  system.placeOrder(order);
  order.addItem(taco, 2);

  step("Attempt: Skip ACCEPTED and go directly to PREPARING");
  try {
    order.startPreparing();
  } catch (e: any) {
    console.log(`  ❌ Rejected: ${e.message}`);
  }

  step("Attempt: Deliver a PLACED order");
  try {
    order.deliver();
  } catch (e: any) {
    console.log(`  ❌ Rejected: ${e.message}`);
  }

  step("Attempt: Pick up without delivery partner assigned");
  restaurant.acceptOrder(order);
  restaurant.startPreparingOrder(order);
  restaurant.markOrderReadyForPickup(order);
  try {
    order.pickUp();  // No delivery partner assigned yet
  } catch (e: any) {
    console.log(`  ❌ Rejected: ${e.message}`);
  }

  step("Attempt: Add items after order is accepted");
  try {
    order.addItem(taco, 1);
  } catch (e: any) {
    console.log(`  ❌ Rejected: ${e.message}`);
  }

  step("Attempt: Cancel after pickup");
  // First, properly assign a partner and pick up
  const dp = new DeliveryPartner("DP20", "Test Partner");
  system.registerDeliveryPartner(dp);
  deliveryService.assignPartnerToOrder(order);
  order.pickUp();
  try {
    order.cancel();
  } catch (e: any) {
    console.log(`  ❌ Rejected: ${e.message}`);
  }

  step("Attempt: Order unavailable food item");
  const soldOutItem = new FoodItem("F21", "Sold Out Special", "Special", 500, false);
  restaurant.menu.addItem(soldOutItem);
  const order2 = customer.createOrder(restaurant);
  try {
    order2.addItem(soldOutItem, 1);
  } catch (e: any) {
    console.log(`  ❌ Rejected: ${e.message}`);
  }
}

// ═══════════════════════════════════════════════════════════════════
// DEMO 4: Concurrency Guard — Double Assignment Prevention
// ═══════════════════════════════════════════════════════════════════

function demoConcurrencyGuard(): void {
  section("DEMO 4: Concurrency Guard — Only One Delivery Partner Per Order");

  const restaurant = new Restaurant("R4", "Sushi Spot");
  const sushi = new FoodItem("F30", "Salmon Nigiri", "Sushi", 220);
  restaurant.menu.addItem(sushi);
  const customer = new Customer("C4", "Meera Nair", "meera@email.com");

  // DON'T register observers so we can manually control assignment
  const deliveryService = new DeliveryService(new RandomAssignmentStrategy());
  const system = new FoodDeliverySystem(deliveryService);

  const dp1 = new DeliveryPartner("DP30", "Partner Alpha");
  const dp2 = new DeliveryPartner("DP31", "Partner Beta");
  system.registerDeliveryPartner(dp1);
  system.registerDeliveryPartner(dp2);

  const order = customer.createOrder(restaurant);
  system.placeOrder(order);
  order.addItem(sushi, 5);
  restaurant.acceptOrder(order);

  step("First partner assignment succeeds");
  order.assignDeliveryPartner(dp1);
  console.log(`  ✅ ${dp1.name} assigned to order #${order.id}`);

  step("Second partner tries to accept the same order");
  try {
    order.assignDeliveryPartner(dp2);
  } catch (e: any) {
    console.log(`  ❌ Rejected: ${e.message}`);
    console.log(`  ↑ This is the concurrency invariant in action.`);
    console.log(`  In production with multiple threads/pods, this would need:`);
    console.log(`    • Database-level optimistic locking (version column + CAS)`);
    console.log(`    • Or SELECT ... FOR UPDATE (pessimistic locking)`);
    console.log(`    • Or an idempotent assignment API with compare-and-swap`);
  }
}

// ═══════════════════════════════════════════════════════════════════
// DEMO 5: Strategy Swap at Runtime
// ═══════════════════════════════════════════════════════════════════

function demoStrategySwap(): void {
  section("DEMO 5: Strategy Swap at Runtime");

  const deliveryService = new DeliveryService(new RandomAssignmentStrategy());
  console.log("  Current strategy: RandomAssignmentStrategy");

  step("Swap to NearestPartnerStrategy");
  deliveryService.setStrategy(new NearestPartnerStrategy());
  console.log("  Strategy swapped to: NearestPartnerStrategy");
  console.log(
    "  DeliveryService didn't change — only the injected strategy object changed."
  );
  console.log(
    "  This is OCP: the service is open for extension (new strategies) " +
    "but closed for modification."
  );
}

// ═══════════════════════════════════════════════════════════════════
// Run all demos
// ═══════════════════════════════════════════════════════════════════

console.log();
console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║   FOOD DELIVERY ORDERING SYSTEM — LLD Demonstration        ║");
console.log("╚══════════════════════════════════════════════════════════════╝");

demoHappyPath();
demoCashOnDelivery();
demoInvalidTransitions();
demoConcurrencyGuard();
demoStrategySwap();

section("ALL DEMOS COMPLETE");
console.log("  ✅ Every major LLD concept has been demonstrated:");
console.log("     • OOP: Classes, encapsulation, composition, association");
console.log("     • Factory: PaymentMethodFactory → PaymentMethod implementations");
console.log("     • Strategy: DeliveryAssignmentStrategy → Random, Nearest");
console.log("     • Observer: Order → OrderEvent → DeliveryService, NotificationObserver");
console.log("     • Enum-based state: OrderStatus with guard-checked transitions");
console.log("     • Price snapshot: OrderItem.priceAtPurchase immutability");
console.log("     • Concurrency guard: Single delivery partner assignment");
console.log("     • SOLID: SRP, OCP, DIP demonstrated throughout");
console.log();
