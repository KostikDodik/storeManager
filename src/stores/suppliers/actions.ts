import type ISupplierState from "./state";
import type {ISupplier} from "@/types/ISupplier";
import {SupplierService} from "@/services/SupplierService";

const supplierService = new SupplierService();

export async function add(state: ISupplierState, supplier: ISupplier) {
    const newSupplier = await supplierService.addSupplier(supplier);
    supplier.id = newSupplier.id;
    if (!await loadList(state)) {
        state.suppliers.value.push(newSupplier);
    }
    // Don't need to refresh as it was not initialised before and now is loaded with changes
}

export async function update(state: ISupplierState, supplier: ISupplier) {
    const updatedSupplier = await supplierService.updateSupplier(supplier);
    if (await loadList(state)) {
        // Don't need to refresh as it was not initialised before and now is loaded with changes
        return;
    }
    const existingSupplier = state.suppliers.value.find(cat => cat.id === updatedSupplier.id);
    if (existingSupplier != null) {
        Object.assign(existingSupplier, updatedSupplier);
    }
}

export async function remove(state: ISupplierState, supplier: ISupplier) {
    await supplierService.deleteSupplier(supplier.id);
    if (await loadList(state)) {
        // Don't need to refresh as it was not initialised before and now is loaded with changes
        return;
    }
    const suppliers = state.suppliers.value;
    const index = suppliers.indexOf(supplier);
    if (index >= 0) {
        suppliers.splice(index, 1);
    }
}

export async function get(state: ISupplierState, id: string) {
    return await supplierService.getSupplier(id);
}

export async function getAll(state: ISupplierState) {
    state.suppliers.value = await supplierService.getAllSuppliers();
}

async function loadList(state: ISupplierState): Promise<boolean> {
    if (state.suppliers.value?.length) {
        return false;
    }
    await getAll(state);
    return true;
}
