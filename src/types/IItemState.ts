export enum ItemState {
    Available = 0,
    Ordered = 1,
    Paid = 2,
    Finished = 3
}

export function itemStateDisplayName (state: ItemState): string {
    switch (state) {
        case ItemState.Available:
            return "";
        case ItemState.Ordered:
            return "Створено";
        case ItemState.Paid:
            return "Оплачено";
        case ItemState.Finished:
            return "Виконано";
    }
}

export const itemStateOptions = [
    {name: itemStateDisplayName(ItemState.Available), value: ItemState.Available},
    {name: itemStateDisplayName(ItemState.Ordered), value: ItemState.Ordered},
    {name: itemStateDisplayName(ItemState.Paid), value: ItemState.Paid},
    {name: itemStateDisplayName(ItemState.Finished), value: ItemState.Finished}
]