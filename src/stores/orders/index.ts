import {defineStore} from "pinia";
import {computed, ref} from "vue";
import type {IOrder} from "@/types/IOrder";
import type {IOrderState, IOrderDictionary} from "./state";
import * as actions from "./actions";

export const useOrdersStore = defineStore('orders', () => {
    const orders = ref<IOrder[]>([]);
    const orderDictionary = ref(<IOrderDictionary>{});

    const state: IOrderState = {orders, orderDictionary};
    const add = async (order: IOrder) => await actions.add(state, order);
    const update = async (order: IOrder) => await actions.update(state, order);
    const remove = async (order: IOrder) => await actions.remove(state, order);
    const init = async () => {
        if (!orders.value.length) await actions.getAll(state)
    };
    const get = async (id: string) => await actions.get(state, id)
    return {orders, init, get, add, remove, update};
});
