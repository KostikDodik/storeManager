import type {ISalesByProduct} from "@/types/ISalesByProduct";
import Service from "@/services/Service";

export class StatisticsService extends Service {
    public async getSalesByProduct(start?: Date, end?: Date): Promise<ISalesByProduct[]> {
        return (await this.get<ISalesByProduct[]>('/statistics/products', {
            params: { start, end }
        })).data;
    }
}