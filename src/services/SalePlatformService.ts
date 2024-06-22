import type {ISalePlatform} from "@/types/ISalePlatform";
import Service from "@/services/Service";

export class SalePlatformService extends Service {
    public async getAllSalePlatforms(): Promise<ISalePlatform[]> {
        return (await this.get<ISalePlatform[]>('/salePlatforms')).data;
    }

    public async getSalePlatform(id: string): Promise<ISalePlatform> {
        return (await this.get<ISalePlatform>(`/salePlatforms/${id}`)).data;
    }

    public async addSalePlatform(salePlatform: ISalePlatform): Promise<ISalePlatform> {
        return (await this.post<ISalePlatform>(`/salePlatforms`, salePlatform)).data;
    }

    public async updateSalePlatform(salePlatform: ISalePlatform): Promise<ISalePlatform> {
        return (await this.put<ISalePlatform>(`/salePlatforms`, salePlatform)).data;
    }

    public async deleteSalePlatform(id: string): Promise<void> {
        await this.delete(`/salePlatforms/${id}`);
    }
}