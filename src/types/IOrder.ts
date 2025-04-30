import { ItemState } from "./IItemState";
import { ISalePlatform } from "./ISalePlatform";
import { PaymentType } from "./PaymentType";

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
    checks: ICheck[];
}

export interface IOrderRow {
    productId: string;
    quantity: number;
    price: number;
    netSum: number;
}

export interface IDisplayOrder extends IOrder {
    salePlatform?: ISalePlatform;
    stateName?: string;
    edited: Date;
}

export interface ICheck {
    id: string;
    orderId: string;
    paymentType: PaymentType;
    sum: number;
    checkLink?: string;
    notes?: string;
}
