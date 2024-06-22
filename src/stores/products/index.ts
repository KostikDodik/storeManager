import {defineStore} from "pinia";
import {computed, ref} from "vue";
import type {IProduct} from "@/types/IProduct";
import type IProductState from "./state";
import * as actions from "./actions";
import {getAvailableProducts} from "./actions";

export const useProductsStore = defineStore('products', () => {
    const products = ref<IProduct[]>([]);

    const state: IProductState = { products };
    const add = async (product: IProduct) => await actions.add(state, product);
    const update = async (product: IProduct) => await actions.update(state, product);
    const remove = async (product: IProduct) => await actions.remove(state, product);
    const init = async () => { if (!products.value.length) await actions.getAll(state) };
    const refresh = async (ids?: string[]) => { if (ids || !products.value.length) await actions.getAvailableProducts(state, ids) }
    const get = async (id: string) => await actions.get(state, id)
    return { products, init, refresh, get, add, remove, update };
});
