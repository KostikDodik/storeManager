export interface IOrder {
  id: string;
  name: string;
  date: Date;
  updatedState: Date;
  trackingNumber: string;
  salePlatformId: string;
  totalSum: number;
  totalIncome: number;
  state: ItemState;
  rows: IOrderRow[];
}

export interface IOrderRow {
  productId: string;
  quantity: number;
  price: number;
}

export enum ItemState {
  Available = 0,
  Ordered = 1,
  Paid = 2,
  Finished = 3
}

export function stateDisplayName (state: ItemState): string {
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

export const stateOptions = [
  {name: stateDisplayName(ItemState.Available), value: ItemState.Available},
  {name: stateDisplayName(ItemState.Ordered), value: ItemState.Ordered},
  {name: stateDisplayName(ItemState.Paid), value: ItemState.Paid},
  {name: stateDisplayName(ItemState.Finished), value: ItemState.Finished}
]