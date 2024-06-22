import type ISalePlatformState from "./state";
import type {ISalePlatform} from "@/types/ISalePlatform";
import {SalePlatformService} from "@/services/SalePlatformService";
import type IProductState from "@/stores/products/state";
const salePlatformService = new SalePlatformService();

export async function add(state: ISalePlatformState, salePlatform: ISalePlatform) {
    const newSalePlatform = await salePlatformService.addSalePlatform(salePlatform);
    salePlatform.id = newSalePlatform.id;
    if (!await loadList(state)) {
        state.salePlatforms.value.push(newSalePlatform);
    }
    // Don't need to refresh as it was not initialised before and now is loaded with changes
}

export async function update(state: ISalePlatformState, salePlatform: ISalePlatform) {
    const updatedSalePlatform = await salePlatformService.updateSalePlatform(salePlatform);
    if (await loadList(state)) {
        // Don't need to refresh as it was not initialised before and now is loaded with changes
        return;
    }
    const existingSalePlatform = state.salePlatforms.value.find(cat => cat.id === updatedSalePlatform.id);
    if (existingSalePlatform != null) {
        Object.assign(existingSalePlatform, updatedSalePlatform);
    }
}

export async function remove(state: ISalePlatformState, salePlatform: ISalePlatform) {
    await salePlatformService.deleteSalePlatform(salePlatform.id);
    if (await loadList(state)) {
        // Don't need to refresh as it was not initialised before and now is loaded with changes
        return;
    }
    const salePlatforms = state.salePlatforms.value;
    const index = salePlatforms.indexOf(salePlatform);
    if (index >= 0) {
        salePlatforms.splice(index, 1);
    }
}

export async function get(state: ISalePlatformState, id: string) {
    return await salePlatformService.getSalePlatform(id);
}

export async function getAll(state: ISalePlatformState) {
    state.salePlatforms.value = await salePlatformService.getAllSalePlatforms();
}

async function loadList(state: ISalePlatformState): Promise<boolean> {
    if (state.salePlatforms.value?.length) {
        return false;
    }
    await getAll(state);
    return true;
}
