import type {ComputedRef, Ref} from "vue";
import {ISalesByCategory, ISalesByProduct} from "@/types/ISalesByProduct";
import {ICategory} from "@/types/ICategory";
import {ITreeNode} from "@/types/ITreeNode";
import {ISupplyStats} from "@/types/ISupplyStats";

export interface IStatisticsState {
    raw: Ref<ISalesByProductCache>,
    formated: Ref<ISalesByCategoryCache>,
    categories: ComputedRef<ICategory[]>,
    supplyStats: Ref<ISupplyStatsCache>
}

export interface ISalesByProductCache {
    [start: string] : {
        [end: string]: ISalesByProduct[]
    }
}

export interface ISupplyStatsCache {
    [start: string] : {
        [end: string]: ISupplyStats
    }
}

export interface ISalesByCategoryCache {
    [start: string] : {
        [end: string]: ITreeNode<ISalesByCategory>[]
    }
}
