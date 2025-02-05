import {SupplyApi} from "./api";
import {useQuery} from "@tanstack/vue-query";
import {IDetailedSupply, ISupply} from "@/types/ISupply";
import {Ref} from "vue";
import {refreshProducts} from "@/services/ProductService";
import {getQueryClient} from "@/services/queryClient";

const api = new SupplyApi();

export const getSuppliesQuery = () => useQuery({
    queryKey: ['supplies', 'all'],
    staleTime: Infinity,
    queryFn: () => api.getAllSupplies()
});

export const getSupplyQuery = (id: Ref<string|undefined>) =>  useQuery({
    queryKey: ['supplies', id],
    staleTime: Infinity,
    queryFn: () => api.getSupply(id.value),
    enabled: () => !!id.value
});

export const addSupply = async (supply: ISupply): Promise<IDetailedSupply> => {
    const data = await api.addSupply(supply);
    await getQueryClient().refetchQueries({ queryKey: ['supplies', 'all']});
    return data;
}

export const updateSupply = async(supply: ISupply): Promise<IDetailedSupply> => {
    const data = await api.updateSupply(supply);
    await getQueryClient().refetchQueries({ queryKey: ['supplies', 'all']});
    return data;
}

export const deleteSupply = async(id?: string) => {
    if (!id) return;
    refreshProducts(await api.deleteSupply(id) ?? []);
    await getQueryClient().refetchQueries({ queryKey: ['supplies', 'all']});
}