import {defineStore} from "pinia";
import {computed, ref} from "vue";
import type {IStatisticsState, ISalesByProductCache, ISalesByCategoryCache} from "./state";
import * as actions from "./actions";
import {useCategoriesStore} from "@/stores/categories";

export const useStatisticsStore = defineStore('salePlatforms', () => {
    const rawData = ref<ISalesByProductCache>({});
    const formatedData = ref<ISalesByCategoryCache>({});
    const categoryStore = useCategoriesStore();
    const initCategories = categoryStore.init();
    const categories = computed(() => categoryStore.categories);
    const init = async () => initCategories;  

    const state: IStatisticsState = { raw: rawData, formated: formatedData, categories };
    const getSaleStatistics = async (start?: Date, end?: Date)=> { await initCategories; return actions.getFormatedData(state, start, end) };
    
    return { getSaleStatistics };
});
