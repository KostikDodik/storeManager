import {defineStore} from "pinia";
import {computed, ref} from "vue";
import type {ICategory} from "@/types/ICategory";
import type ICategoryState from "./state";
import * as actions from "./actions";

export const useCategoriesStore = defineStore('categories', () => {
    const categories = ref<ICategory[]>([]);
    const flatCategories = computed<ICategory[]>(() => 
        categories.value.flatMap(c => actions.flattenCategories(c)));

    const state: ICategoryState = { categories, flatCategories };
    const add = async (category: ICategory) => await actions.add(state, category);
    const update = async (category: ICategory) => await actions.update(state, category);
    const remove = async (category: ICategory) => await actions.remove(state, category);
    const init = async () => { if (!categories.value.length) await actions.getAll(state) }; 
    return { categories, flatCategories, init, add, update, remove };
});
