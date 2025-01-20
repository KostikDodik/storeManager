import {useQuery, UseQueryReturnType} from '@tanstack/vue-query';
import {SalePlatformApi} from "./api";
import {ISalePlatform} from "@/types/ISalePlatform";
import {getQueryClient} from "@/services/queryClient";

const api = new SalePlatformApi();

export const getSalePlatformsQuery = () => useQuery({
    queryKey: ['allSalePlatforms'],
    staleTime: Infinity,
    queryFn: () => api.getAll()
});

export const addSalePlatform = async (salePlatform: ISalePlatform) => {
    const res = await api.addSalePlatform(salePlatform);
    await getQueryClient().refetchQueries({ queryKey: ['allSalePlatforms']});
    return res
}

export const updateSalePlatform = async(salePlatform: ISalePlatform): Promise<ISalePlatform> => {
    const data = await api.updateSalePlatform(salePlatform);
    await getQueryClient().refetchQueries({ queryKey: ['allSalePlatforms']});
    return data;
}

export const deleteSalePlatform = async(id?: string) => {
    if (!id) return;
    await api.deleteSalePlatform(id);
    await getQueryClient().refetchQueries({ queryKey: ['allSalePlatforms']});
}