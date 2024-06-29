import type IProductState from "./state";
import type {IProduct} from "@/types/IProduct";
import {ProductService} from "@/services/ProductService";
import type {IOrderState} from "@/stores/orders/state";
const productService = new ProductService();

export async function add(state: IProductState, product: IProduct) {
    const newProduct = await productService.addProduct(product);
    product.id = newProduct.id;
    if (!await loadList(state)) {
        state.setCurrentPage(0);
        state.products.value.push(newProduct);
    }
    // Don't need to refresh as it was not initialised before and now is loaded with changes
}

export async function update(state: IProductState, product: IProduct) {
    const updatedProduct = await productService.updateProduct(product);
    if (await loadList(state)) {
        // Don't need to refresh as it was not initialised before and now is loaded with changes
        return;
    }
    const existingProduct = state.products.value.find(cat => cat.id === updatedProduct.id);
    if (existingProduct != null) {
        Object.assign(existingProduct, updatedProduct);
    }
}

export async function remove(state: IProductState, product: IProduct) {
    await productService.deleteProduct(product.id);
    if (await loadList(state)) {
        // Don't need to refresh as it was not initialised before and now is loaded with changes
        return;
    }
    const products = state.products.value;
    const index = products.indexOf(product);
    if (index >= 0) {
        products.splice(index, 1);
    }
}

export async function get(state: IProductState, id: string) {
    return await productService.getProduct(id);
}

export async function getAll(state: IProductState) {
    state.products.value = await productService.getAvailableProducts();
}

export async function getAvailableProducts(state: IProductState, ids?: string[]) {
    if (!ids || !state.products.value?.length) {
        state.products.value = await productService.getAvailableProducts();
        return;
    }
    const updated = await productService.getAvailableProducts(ids);
    for (let updatedProduct of updated) {
        const existingProduct = state.products.value.find(p => p.id === updatedProduct.id);
        if (existingProduct != null) {
            Object.assign(existingProduct, updatedProduct);
        } else {
            state.products.value.push(updatedProduct);
        }
    }
}

async function loadList(state: IProductState): Promise<boolean> {
    if (state.products.value?.length) {
        return false;
    }
    await getAll(state);
    return true;
}
