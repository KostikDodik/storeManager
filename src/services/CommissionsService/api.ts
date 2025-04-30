import Service from "@/services/Service";
import { ICommissionCategory } from "@/types/ICommission";

export class CommissionApi extends Service {
    public async getForCategory(id: string): Promise<ICommissionCategory[]> {
        return (await this.get<ICommissionCategory[]>(`/commissions/categories/${id}`)).data;
    }

    public async addCommission(commission: ICommissionCategory): Promise<ICommissionCategory> {
        return (await this.post<ICommissionCategory>(`/commissions`, commission)).data;
    }

    public async updateCommission(commission: ICommissionCategory): Promise<ICommissionCategory> {
        return (await this.put<ICommissionCategory>(`/commissions`, commission)).data;
    }

    public async deleteCommission(id: string): Promise<void> {
        await this.delete(`/commissions/${id}`);
    }
    
}