import {useQuery, UseQueryReturnType} from '@tanstack/vue-query';
import {SupplierApi} from "./api";
import {ISupplier} from "@/types/ISupplier";
import {getQueryClient} from "@/services/queryClient";

const api = new SupplierApi();


export const getSuppliersQuery = () => useQuery({
    queryKey: ['allSuppliers'],
    staleTime: Infinity,
    queryFn: () => api.getAll()
});

export const addSupplier = async (supplier: ISupplier) => {
    const res = await api.addSupplier(supplier);    
    await getQueryClient().refetchQueries({ queryKey: ['allSuppliers']});
    return res;
}

export const updateSupplier = async(supplier: ISupplier): Promise<ISupplier> => {
    const data = await api.updateSupplier(supplier);
    await getQueryClient().refetchQueries({ queryKey: ['allSuppliers']});
    return data;
}

export const deleteSupplier = async(id?: string) => {
    if (!id) return;
    await api.deleteSupplier(id);
    await getQueryClient().refetchQueries({ queryKey: ['allSuppliers']});
}