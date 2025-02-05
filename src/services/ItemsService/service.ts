import {ItemApi} from "./api";
import {useQuery} from "@tanstack/vue-query";
import {Ref} from "vue";
import {getQueryClient} from "../queryClient";

const api = new ItemApi();

export const getItemPageQuery = (productId: Ref<string|undefined>, onlyAvailable: Ref<boolean|undefined>, sortOrder: Ref<number|undefined>, page: Ref<number|undefined>) => useQuery({
    queryKey: ['items', 'page', productId, onlyAvailable, sortOrder, page],
    staleTime: Infinity,
    queryFn: () => api.getPage(productId.value, onlyAvailable.value, sortOrder.value, page.value)
});
export const getItemCountQuery = (productId: Ref<string|undefined>, onlyAvailable: Ref<boolean|undefined>) => useQuery({
    queryKey: ['items', 'count', productId, onlyAvailable],
    staleTime: Infinity,
    queryFn: () => api.getCount(productId.value, onlyAvailable.value)
});

export const invalidateItemPages = async () => {
    await getQueryClient().invalidateQueries({ queryKey: ["items"], exact: false });
}

export const updateBBDate = async (itemIds: string[], bbDate: Date) => {
    await api.updateBBdate(itemIds, bbDate);
    await invalidateItemPages();
}

export const getItemsForSupplyQuery = (supplyId: Ref<string|undefined>) => useQuery({
    queryKey: ['items', 'supply', supplyId],
    staleTime: Infinity,
    queryFn: () => api.forSupply(<string>supplyId.value),
    enabled: () => !!supplyId.value
})

export const getExpiringItemsQuery = () => useQuery({
    queryKey: ['items', 'expiring'],
    staleTime: Infinity,
    queryFn: () => api.getExpiringItems()
});