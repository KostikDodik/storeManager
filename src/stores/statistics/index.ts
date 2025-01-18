import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {IStatisticsState, ISalesByProductCache, ISalesByCategoryCache, ISupplyStatsCache} from "./state";
import * as actions from "./actions";
import {getCategoriesQuery} from "@/services/CategoryService";

export const useStatisticsStore = defineStore('statistics', () => {
    const rawData = ref<ISalesByProductCache>({});
    const formatedData = ref<ISalesByCategoryCache>({});
    const supplyStats = ref<ISupplyStatsCache>({});
    const categoriesQuery = getCategoriesQuery();
    const categories = computed(() => categoriesQuery.data?.value);

    const state: IStatisticsState = { raw: rawData, formated: formatedData, categories, supplyStats };
    const getSaleStatistics = async (start?: Date, end?: Date)=> { return actions.getFormatedData(state, start, end) };
    const getSupplyStatistics = async (start?: Date, end?: Date) => actions.getSupplyStatistics(state, start, end);
    
    return { getSaleStatistics, getSupplyStatistics };
});
