import {defineStore} from "pinia";
import {computed, ref} from "vue";
import type {ISalePlatform} from "@/types/ISalePlatform";
import type ISalePlatformState from "./state";
import * as actions from "./actions";

export const useSalePlatformsStore = defineStore('salePlatforms', () => {
    const salePlatforms = ref<ISalePlatform[]>([]);

    const state: ISalePlatformState = { salePlatforms };
    const add = async (salePlatform: ISalePlatform) => await actions.add(state, salePlatform);
    const update = async (salePlatform: ISalePlatform) => await actions.update(state, salePlatform);
    const remove = async (salePlatform: ISalePlatform) => await actions.remove(state, salePlatform);
    const init = async () => { if (!salePlatforms.value.length) await actions.getAll(state) };
    return { salePlatforms, init, add, remove, update };
});
