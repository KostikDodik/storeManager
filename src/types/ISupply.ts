import {SupplyState} from "@/types/ISupplyState";

export interface ISupplyRow {
    id: string;
    productId: string;
    supplyPrice: number;
    count: number;
    deliveryPrice: number;
    supplyId: string;
}

export interface ISupply {
    id: string;
    name: string;
    supplierId: string;
    number: number;
    date: Date;
    dateEdited: Date;
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