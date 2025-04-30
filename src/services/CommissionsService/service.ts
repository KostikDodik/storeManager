import { useQuery, UseQueryReturnType } from '@tanstack/vue-query';
import { CommissionApi } from "./api";
import { ICommissionCategory } from "@/types/ICommission";
import { getQueryClient } from "@/services/queryClient";
import { Ref, toRef } from "vue";

const api = new CommissionApi();
const commissionsQueryKey = "CommissionsForCategory"
export const getForCategoryQuery = (categoryId: Ref<string>) => useQuery({
    queryKey: [commissionsQueryKey, categoryId],
    staleTime: Infinity,
    queryFn: () => api.getForCategory(categoryId.value),
    enabled: () => !!categoryId.value
});

const refetchCommissions = (categoryId: string): void => {
    getQueryClient().refetchQueries({ queryKey: [commissionsQueryKey, toRef(categoryId)] })
}


export const addCommissionCategory = async(commission: ICommissionCategory) => {
    const res = await api.addCommission(commission);
    refetchCommissions(commission.categoryId);
    return res;
}

export const updateCommissionCategory = async(commission: ICommissionCategory): Promise<ICommissionCategory> => {
    const data = await api.updateCommission(commission);
    refetchCommissions(commission.categoryId);
    return data;
}

export const deleteCommissionCategory = async(commission: ICommissionCategory) => {
    const id = commission?.id;
    if (!id) return;
    await api.deleteCommission(id);
    refetchCommissions(commission.categoryId);
}