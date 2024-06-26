import type {ISupplyState} from "./state";
import type {ISupply} from "@/types/ISupply";
import {SupplyService} from "@/services/SupplyService";

const supplyService = new SupplyService();

export async function add(state: ISupplyState, supply: ISupply) {
    const newSupply = await supplyService.addSupply(supply);
    if (!await loadList(state)) {
        state.setCurrentPage(0);
        state.supplies.value.splice(0, 0, newSupply);        
    }
}

export async function update(state: ISupplyState, supply: ISupply) {
    const updatedSupply = await supplyService.updateSupply(supply);
    if (!await loadList(state)) {
        let existingSupply = state.supplies.value.find(cat => cat.id === updatedSupply.id);
        if (existingSupply != null) {
            Object.assign(existingSupply, updatedSupply);
        }
    }
    {
        let existingSupply = state.supplyDictionary.value[updatedSupply.id];
        if (existingSupply != null) {
            Object.assign(existingSupply, updatedSupply);
        } else {
            state.supplyDictionary.value[updatedSupply.id] = updatedSupply;
        }
    }
}

export async function remove(state: ISupplyState, supply: ISupply) {
    await supplyService.deleteSupply(supply.id);
    if (await loadList(state)) {
        // Don't need to refresh as it was not initialised before and now is loaded with changes
        return;
    }
    const supplies = state.supplies.value;
    const index = supplies.indexOf(supply);
    if (index >= 0) {
        supplies.splice(index, 1);
    }
}

export async function get(state: ISupplyState, id: string) {
    let supply = state.supplyDictionary.value[id];
    if (!supply) {
        supply = await supplyService.getSupply(id);
        state.supplyDictionary.value[id] = supply;
    }
    return supply;
}

export async function getAll(state: ISupplyState) {
    state.supplies.value = await supplyService.getAllSupplies();
}

async function loadList(state: ISupplyState): Promise<boolean> {
    if (state.supplies.value?.length) {
        return false;
    }
    await getAll(state);
    return true;
}

export function calculateDeliveryFees(supply: ISupply) {
    if (!supply?.rows || !supply.deliveryFee) {
        return;
    }
    let valueWiseFractioningSize: number = 0;
    for (let row of supply.rows) {
        valueWiseFractioningSize += (row.count ?? 0) * (row.supplyPrice ?? 0);
    }
    if (!valueWiseFractioningSize) {
        return;
    }
    const fraction = supply.deliveryFee / valueWiseFractioningSize;
    supply.rows.forEach(row => {
        row.deliveryPrice = Math.round((row.supplyPrice ?? 0) * fraction * 100) / 100;
    });
}

export function getSupplySum(supply: ISupply): number {
    return supply?.rows?.reduce((partialSum, row) => partialSum + row.count * row.supplyPrice, 0) ?? 0;
}

export function getSupplyDeliveryFee(supply: ISupply): number {
    return supply?.rows?.reduce((partialSum, row) => partialSum + row.count * row.deliveryPrice, 0) ?? 0;
}

export function getSupplyCount(supply: ISupply): number {
    return supply?.rows?.reduce((partialSum, row) => partialSum + row.count, 0) ?? 0;
}

export function getSupplyIncome(supply: ISupply): number {
    return (supply?.soldMoney ?? 0) - getSupplySum(supply) - getSupplyDeliveryFee(supply);
}
