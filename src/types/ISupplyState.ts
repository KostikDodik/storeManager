import {ISelectOption} from "@/types/ISelectOption";

export enum SupplyState {
    Paid = 0,
    DeliveredToStorage = 1,
    SentToUkraine = 2,
    Received = 3,
    SoldOut = 4
}

export function supplyStateDisplayName (state: SupplyState): string {
    switch (state) {
        case SupplyState.Paid:
            return "Створено і оплачено";
        case SupplyState.DeliveredToStorage:
            return "Надійшло на склад";
        case SupplyState.SentToUkraine:
            return "Відправлено в Україну";
        case SupplyState.Received:
            return "Отримано";
        case SupplyState.SoldOut:
            return "Розпродано"
    }
}

export const supplyStateOptions: ISelectOption[] = [
    {name: supplyStateDisplayName(SupplyState.Paid), value: SupplyState.Paid},
    {name: supplyStateDisplayName(SupplyState.DeliveredToStorage), value: SupplyState.DeliveredToStorage},
    {name: supplyStateDisplayName(SupplyState.SentToUkraine), value: SupplyState.SentToUkraine},
    {name: supplyStateDisplayName(SupplyState.Received), value: SupplyState.Received},
    {name: supplyStateDisplayName(SupplyState.SoldOut), value: SupplyState.SoldOut, disabled: true }
]