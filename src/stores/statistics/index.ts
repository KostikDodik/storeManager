import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {IStatisticsState, ISalesByProductCache, ISalesByCategoryCache, ISupplyStatsCache} from "./state";
import * as actions from "./actions";
import {useCategoriesStore} from "@/stores/categories";

export const useStatisticsStore = defineStore('statistics', () => {
    const rawData = ref<ISalesByProductCache>({});
    const formatedData = ref<ISalesByCategoryCache>({});
    const supplyStats = ref<ISupplyStatsCache>({});
    const categoryStore = useCategoriesStore();
    const initCategories = categoryStore.init();
    const categories = computed(() => categoryStore.categories);
    const init = async () => initCategories;  

    const state: IStatisticsState = { raw: rawData, formated: formatedData, categories, supplyStats };
    const getSaleStatistics = async (start?: Date, end?: Date)=> { await initCategories; return actions.getFormatedData(state, start, end) };
    const getSupplyStatistics = async (start?: Date, end?: Date) => actions.getSupplyStatistics(state, start, end);
    
    return { getSaleStatistics, getSupplyStatistics };
});
