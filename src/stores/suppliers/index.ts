import {defineStore} from "pinia";
import {computed, ref} from "vue";
import type {ISupplier} from "@/types/ISupplier";
import type ISupplierState from "./state";
import * as actions from "./actions";

export const useSuppliersStore = defineStore('suppliers', () => {
    const suppliers = ref<ISupplier[]>([]);

    const state: ISupplierState = { suppliers };
    const add = async (supplier: ISupplier) => await actions.add(state, supplier);
    const update = async (supplier: ISupplier) => await actions.update(state, supplier);
    const remove = async (supplier: ISupplier) => await actions.remove(state, supplier);
    const init = async () => { if (!suppliers.value.length) await actions.getAll(state) };
    return { suppliers, init, add, remove, update };
});
