import type {ISupplier} from "@/types/ISupplier";
import Service from "@/services/Service";

export class SupplierService extends Service {
    public async getAllSuppliers(): Promise<ISupplier[]> {
        return (await this.get<ISupplier[]>('/suppliers')).data;
    }

    public async getSupplier(id: string): Promise<ISupplier> {
        return (await this.get<ISupplier>(`/supplier/${id}`)).data;
    }

    public async addSupplier(supplier: ISupplier): Promise<ISupplier> {
        return (await this.post<ISupplier>(`/suppliers`, supplier)).data;
    }

    public async updateSupplier(supplier: ISupplier): Promise<ISupplier> {
        return (await this.put<ISupplier>(`/suppliers`, supplier)).data;
    }

    public async deleteSupplier(id: string): Promise<void> {
        await this.delete(`/suppliers/${id}`);
    }
}