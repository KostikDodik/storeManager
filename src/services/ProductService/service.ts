import {ProductService} from "./api";
import {useQuery} from "@tanstack/vue-query";
import {IProduct} from "@/types/IProduct";
import {ref, Ref} from "vue";
import {getQueryClient} from "../queryClient";
import {invalidateItemPages} from "../ItemsService";

const api = new ProductService();

let availableProducts: Ref<IProduct[]>;
const getAvailableProducts = async(force?: boolean) => {
    if (!availableProducts) {
        availableProducts = ref([]);
    }
    if (force || !availableProducts.value?.length) {
        availableProducts.value = await api.getAvailableProducts();
    }
    return availableProducts.value;
}

export const getAllProductsQuery = () =>  useQuery({
    queryKey: ['products', 'all'],
    staleTime: Infinity,
    queryFn: () => getAvailableProducts()
});

export const refreshProducts = async(products: IProduct[]) => {
    invalidateItemPages();
    if (!availableProducts) {
        return;
    }
    for (let updatedProduct of products) {
        const existingProduct = availableProducts.value.find(p => p.id === updatedProduct.id);
        if (existingProduct != null) {
            Object.assign(existingProduct, updatedProduct);
        } else {
            availableProducts.value.push(updatedProduct);
        }
    }
    await getQueryClient().refetchQueries({ queryKey: ['products', 'all']});
}

export const refreshProductsById = async(ids?: string[]) => {
    if (!availableProducts) {
        return;
    }
    if (!ids || !availableProducts.value?.length) {
        availableProducts.value = await getAvailableProducts(true);
        invalidateItemPages();
        await getQueryClient().refetchQueries({ queryKey: ['products', 'all']});
        return;
    }

    const updated = await api.getAvailableProducts(ids);
    await refreshProducts(updated);
}

export const getProductQuery = (id: Ref<string|undefined>) =>  useQuery({
    queryKey: ['products', id],
    staleTime: Infinity,
    queryFn: () => api.getProduct(<string>id.value),
    enabled: () => !!id.value
});

export const addProduct = async (product: IProduct) => {
    const saved = await api.addProduct(product);
    await refreshProductsById([saved.id]);
    return saved;
}

export const updateProduct = async(product: IProduct): Promise<IProduct> => {
    const data = await api.updateProduct(product);
    await refreshProductsById([data.id]);
    return data;
}

export const deleteProduct = async(id?: string) => {
    if (!id) return;
    await api.deleteProduct(id);
    if (availableProducts?.value?.length) {
        const ind = availableProducts.value.findIndex(p => p.id === id);
        if (ind >= 0) {
            availableProducts.value.splice(ind, 1);          
        }
    }
    await getQueryClient().refetchQueries({ queryKey: ['products', 'all']});
}