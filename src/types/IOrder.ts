import {ItemState} from "@/types/IItemState";
import {ISalePlatform} from "@/types/ISalePlatform";

export interface IOrder {
  id: string;
  name: string;
  date: Date;
  dateEdited: Date;
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

export interface IDisplayOrder extends IOrder {
  salePlatform?: ISalePlatform;
  stateName?: string;
  edited: Date;
}