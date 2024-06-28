import {ItemState} from "@/types/IItemState";

export interface IOrder {
  id: string;
  name: string;
  date: Date;
  updatedState: Date;
  trackingNumber: string;
  salePlatformId: string;
  totalSum: number;
  totalIncome: number;
  number: number;
  state: ItemState;
  rows: IOrderRow[];
}

export interface IOrderRow {
  productId: string;
  quantity: number;
  price: number;
}