import type {Ref} from "vue";
import {ISupply} from "@/types/ISupply";

export interface ISupplyState {
    supplies: Ref<ISupply[]>
    supplyDictionary: Ref<ISupplyDictionary>,
    setCurrentPage: (page: number) => void
}

export interface ISupplyDictionary {
    [key: string]: ISupply
}
