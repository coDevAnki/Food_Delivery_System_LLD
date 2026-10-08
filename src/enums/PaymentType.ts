/**
 * PaymentType identifies the kind of payment mechanism.
 * Used by PaymentMethodFactory to instantiate the correct PaymentMethod.
 */
export enum PaymentType {
  UPI    = "UPI",
  CARD   = "CARD",
  WALLET = "WALLET",
  CASH   = "CASH",
}
