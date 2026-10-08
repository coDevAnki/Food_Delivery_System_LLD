"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentType = void 0;
/**
 * PaymentType identifies the kind of payment mechanism.
 * Used by PaymentMethodFactory to instantiate the correct PaymentMethod.
 */
var PaymentType;
(function (PaymentType) {
    PaymentType["UPI"] = "UPI";
    PaymentType["CARD"] = "CARD";
    PaymentType["WALLET"] = "WALLET";
    PaymentType["CASH"] = "CASH";
})(PaymentType || (exports.PaymentType = PaymentType = {}));
//# sourceMappingURL=PaymentType.js.map