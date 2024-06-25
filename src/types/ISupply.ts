export interface ISupplyRow {
    id: string;
    productId: string;
    supplyPrice: number;
    count: number;
    deliveryPrice: number;
    supplyId: string;
}

export enum SupplyState {
    Paid = 0,
    DeliveredToStorage = 1,
    SentToUkraine = 2,
    Received = 3
}

export function stateDisplayName (state: SupplyState): string {
    switch (state) {
        case SupplyState.Paid:
            return "Створено і оплачено";
        case SupplyState.DeliveredToStorage:
            return "Надійшло на склад";
        case SupplyState.SentToUkraine:
            return "Відправлено в Україну";
        case SupplyState.Received:
            return "Отримано";
    }
}

export const stateOptions = [
    {name: stateDisplayName(SupplyState.Paid), value: SupplyState.Paid},
    {name: stateDisplayName(SupplyState.DeliveredToStorage), value: SupplyState.DeliveredToStorage},
    {name: stateDisplayName(SupplyState.SentToUkraine), value: SupplyState.SentToUkraine},
    {name: stateDisplayName(SupplyState.Received), value: SupplyState.Received}
]

export interface ISupply {
    id: string;
    name: string;
    supplierId: string;
    number: number;
    date: Date;
    state: SupplyState;
    trackingNumber: string;
    updatedState: Date;
    deliveryFee: number;
    totalSum?: number;
    totalCount?: number;
    soldCount?: number;
    soldMoney?: number;
    totalIncome?: number;
    rows?: ISupplyRow[];
}