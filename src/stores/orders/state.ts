import type {Ref} from "vue";
import {IOrder} from "@/types/IOrder";

export interface IOrderState {
    orders: Ref<IOrder[]>
    orderDictionary: Ref<IOrderDictionary>
}

export interface IOrderDictionary {
    [key: string]: IOrder
}
