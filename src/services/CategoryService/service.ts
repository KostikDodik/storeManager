import {useQuery, UseQueryReturnType} from '@tanstack/vue-query';
import {CategoryApi} from "./api";
import {ICategory} from "@/types/ICategory";
import {getQueryClient} from "@/services/queryClient";

const api = new CategoryApi();

export const getCategoriesQuery = () => useQuery({
    queryKey: ['allCategories'],
    staleTime: Infinity,
    queryFn: () => api.getAll()
});

export const addCategory = async (category: ICategory) => {
    await api.addCategory(category);
    await getQueryClient().refetchQueries({ queryKey: ['allCategories']});
}

export const updateCategory = async(category: ICategory): Promise<ICategory> => {
    const data = await api.updateCategory(category);
    await getQueryClient().refetchQueries({ queryKey: ['allCategories']});
    return data;
}

export const deleteCategory = async(id?: string) => {
    if (!id) return;
    await api.deleteCategory(id);
    await getQueryClient().refetchQueries({ queryKey: ['allCategories']});
}