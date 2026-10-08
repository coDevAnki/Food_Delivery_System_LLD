import { Customer } from "../models/Customer";
import { Restaurant } from "../models/Restaurant";
import { DeliveryPartner } from "../models/DeliveryPartner";
import { Order } from "../models/Order";
import { Payment } from "../models/Payment";
import { Invoice } from "../models/Invoice";
import { DeliveryService } from "./DeliveryService";
import { PaymentMethodFactory } from "../payment/PaymentMethodFactory";
import { PaymentType } from "../enums/PaymentType";
import { PaymentStatus } from "../enums/PaymentStatus";
import { OrderStatus } from "../enums/OrderStatus";
import { OrderObserver } from "../interfaces/OrderObserver";

/**
 * FoodDeliverySystem is the composition root / orchestration layer.
 *
 * WHY THIS CLASS EXISTS:
 *   It wires together the major components of the system and provides
 *   high-level operations. Think of it as the application's entry point
 *   that knows HOW to compose the pieces, but delegates actual work
 *   to the appropriate domain objects and services.
 *
 * WHAT IT IS NOT:
 *   A God object. It does NOT:
 *     - Calculate prices (Order/OrderItem do that)
 *     - Manage order state (Order does that)
 *     - Select delivery partners (DeliveryService + Strategy do that)
 *     - Process payments (Payment + PaymentMethod do that)
 *
 * RESPONSIBILITY:
 *   1. Registers restaurants, customers, delivery partners
 *   2. Wires observers to orders
 *   3. Provides high-level operations (processPayment, generateInvoice)
 *      that coordinate across domain boundaries
 *
 * RELATIONSHIPS:
 *   - Knows about all major entities (it's the composition root)
 *   - Delegates to DeliveryService for delivery concerns
 *   - Delegates to PaymentMethodFactory for payment creation
 *
 * SOLID:
 *   SRP — Orchestration only; real logic lives in domain objects.
 */
export class FoodDeliverySystem {
  private readonly restaurants: Restaurant[] = [];
  private readonly customers: Customer[] = [];
  private readonly orders: Order[] = [];
  private readonly invoices: Invoice[] = [];
  private readonly observers: OrderObserver[] = [];
  private invoiceCounter = 0;
  private paymentCounter = 0;

  constructor(private readonly deliveryService: DeliveryService) {
    // DeliveryService is itself an observer; register it
    this.observers.push(deliveryService);
  }

  /** Register an additional observer that all new orders will subscribe to. */
  addObserver(observer: OrderObserver): void {
    this.observers.push(observer);
  }

  registerRestaurant(restaurant: Restaurant): void {
    this.restaurants.push(restaurant);
  }

  registerCustomer(customer: Customer): void {
    this.customers.push(customer);
  }

  registerDeliveryPartner(partner: DeliveryPartner): void {
    this.deliveryService.addPartner(partner);
  }

  /**
   * Place an order and wire up all observers.
   * The order is created by the Customer (domain-driven),
   * then the system subscribes all registered observers.
   */
  placeOrder(order: Order): void {
    // Subscribe all registered observers to this order
    for (const observer of this.observers) {
      order.subscribe(observer);
    }
    this.orders.push(order);
  }

  /**
   * Create and process a payment for an order.
   *
   * This method coordinates between:
   *   - PaymentMethodFactory (creates the right PaymentMethod)
   *   - Payment (processes via the method)
   *   - Order (associates the payment)
   *
   * This coordination logic lives here (not in Order) because
   * payment involves multiple components that Order shouldn't know about.
   */
  processPayment(order: Order, paymentType: PaymentType): Payment {
    this.paymentCounter++;
    const paymentMethod = PaymentMethodFactory.create(paymentType);
    const payment = new Payment(
      `PAY-${this.paymentCounter}`,
      order,
      order.getTotal(),
      paymentMethod
    );
    payment.processPayment();
    order.setPayment(payment);
    return payment;
  }

  /**
   * Generate an invoice for a completed order.
   * Only generates if the order is delivered and payment is successful.
   */
  generateInvoice(order: Order): Invoice {
    if (order.status !== OrderStatus.DELIVERED) {
      throw new Error("Invoice can only be generated for delivered orders");
    }
    if (!order.payment) {
      throw new Error("Invoice requires a payment to be associated");
    }
    if (order.payment.status !== PaymentStatus.SUCCESS) {
      throw new Error(
        `Invoice requires successful payment. Current status: ${order.payment.status}`
      );
    }

    this.invoiceCounter++;
    const invoice = new Invoice(
      `INV-${this.invoiceCounter}`,
      order,
      order.payment
    );
    this.invoices.push(invoice);
    return invoice;
  }

  getOrders(): ReadonlyArray<Order> {
    return this.orders;
  }

  getInvoices(): ReadonlyArray<Invoice> {
    return this.invoices;
  }
}
