import type {ICategory} from "@/types/ICategory";
import Service from "@/services/Service";

export class CategoryService extends Service {
    public async getAll(): Promise<ICategory[]> {
        return (await this.get<ICategory[]>('/categories')).data;
    }

    public async addCategory(category: ICategory): Promise<ICategory> {
        return (await this.post<ICategory>(`/categories`, category)).data;
    }

    public async updateCategory(category: ICategory): Promise<ICategory> {
        return (await this.put<ICategory>(`/categories`, category)).data;
    }

    public async deleteCategory(id: string): Promise<void> {
        await this.delete(`/categories/${id}`);
    }
    
}