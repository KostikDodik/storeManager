import {defineStore} from "pinia";
import {computed, ref} from "vue";
import type {ISupply} from "@/types/ISupply";
import type {ISupplyState, ISupplyDictionary} from "./state";
import * as actions from "./actions";

export const useSuppliesStore = defineStore('supplies', () => {
    const supplies = ref<ISupply[]>([]);
    const supplyDictionary = ref(<ISupplyDictionary>{});

    const state: ISupplyState = {supplies, supplyDictionary};
    const add = async (supply: ISupply) => await actions.add(state, supply);
    const update = async (supply: ISupply) => await actions.update(state, supply);
    const remove = async (supply: ISupply) => await actions.remove(state, supply);
    const calculateDeliveryFees = (supply: ISupply) => actions.calculateDeliveryFees(supply);
    const init = async () => {
        if (!supplies.value.length) await actions.getAll(state)
    };
    const get = async (id: string) => await actions.get(state, id)
    return {
        supplies, init, get, add, remove, update, calculateDeliveryFees,
        getSupplySum: actions.getSupplySum,
        getSupplyCount: actions.getSupplyCount,
        getSupplyDeliveryFee: actions.getSupplyDeliveryFee,
        getSupplyIncome: actions.getSupplyIncome
    };
});
