export enum PaymentType {
    Iban = 0,
    Card = 1,
    NovaPay = 2,
    RozetkaPay = 3
}

export function paymentTypeDisplayName(state: PaymentType): string {
    switch (state) {
        case PaymentType.Iban:
            return "IBAN";
        case PaymentType.Card:
            return "На картку";
        case PaymentType.NovaPay:
            return "NovaPay";
        case PaymentType.RozetkaPay:
            return "RPay";
    }
}

export const paymentTypeOptions = [
    { name: paymentTypeDisplayName(PaymentType.Iban), value: PaymentType.Iban },
    { name: paymentTypeDisplayName(PaymentType.Card), value: PaymentType.Card },
    { name: paymentTypeDisplayName(PaymentType.NovaPay), value: PaymentType.NovaPay },
    { name: paymentTypeDisplayName(PaymentType.RozetkaPay), value: PaymentType.RozetkaPay }
]