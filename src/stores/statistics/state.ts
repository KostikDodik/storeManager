import type {ComputedRef, Ref} from "vue";
import {ISalesByCategory, ISalesByProduct} from "@/types/ISalesByProduct";
import {ICategory} from "@/types/ICategory";
import {ITreeNode} from "@/types/ITreeNode";

export interface IStatisticsState {
    raw: Ref<ISalesByProductCache>,
    formated: Ref<ISalesByCategoryCache>,
    categories: ComputedRef<ICategory[]>
}

export interface ISalesByProductCache {
    [start: string] : {
        [end: string]: ISalesByProduct[]
    }
}

export interface ISalesByCategoryCache {
    [start: string] : {
        [end: string]: ITreeNode<ISalesByCategory>[]
    }
}
