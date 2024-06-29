import type {ISalesByProduct} from "@/types/ISalesByProduct";
import Service from "@/services/Service";
import {ISupplyStats} from "@/types/ISupplyStats";

export class StatisticsService extends Service {
    public async getSalesByProduct(start?: Date, end?: Date): Promise<ISalesByProduct[]> {
        return (await this.get<ISalesByProduct[]>('/statistics/products', {
            params: { start, end }
        })).data;
    }
    public async getSupplyStatistics(start?: Date, end?: Date): Promise<ISupplyStats> {
        return (await this.get<ISupplyStats>('/statistics/supplies', {
            params: { start, end }
        })).data;
    }
}