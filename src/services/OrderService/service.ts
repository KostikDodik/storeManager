import {OrderApi} from "./api";
import {QueryClient, useQuery, useQueryClient, UseQueryReturnType} from "@tanstack/vue-query";
import {IOrder} from "@/types/IOrder";
import {Ref} from "vue";
import {refreshProducts} from "@/services/ProductService";
import {getQueryClient} from "@/services/queryClient";

const api = new OrderApi();

export const getOrdersQuery = () => useQuery({
    queryKey: ['allOrders'],
    staleTime: Infinity,
    queryFn: () => api.getAllOrders()
});
export const getOrderQuery = (id: Ref<string|undefined>) => useQuery({
    queryKey: ['orders', id],
    staleTime: Infinity,
    queryFn: () => api.getOrder(id.value),
    enabled: () => !!id.value
});

export const addOrder = async (order: IOrder) => {
    await api.addOrder(order);
    await getQueryClient().refetchQueries({ queryKey: ['allOrders']});
}

export const updateOrder = async(order: IOrder): Promise<IOrder> => {
    const data = await api.updateOrder(order);
    await getQueryClient().refetchQueries({ queryKey: ['allOrders']});
    return data;
}

export const deleteOrder = async(id?: string) => {
    if (!id) return;
    refreshProducts(await api.deleteOrder(id));
    await getQueryClient().refetchQueries({ queryKey: ['allOrders']});
}