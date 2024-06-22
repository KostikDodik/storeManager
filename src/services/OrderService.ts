import type {IOrder} from "@/types/IOrder";
import Service from "@/services/Service";

interface IRawOrder extends Omit<IOrder, 'date'|'updatedState'> {
    date: string | Date
    updatedState: string | Date
}
function formatDates(raw: IRawOrder): IOrder {
    if (typeof raw.date === "string") {
        raw.date = new Date(raw.date);
    }
    if (typeof raw.updatedState === "string") {
        raw.updatedState = new Date(raw.updatedState);
    }
    return <IOrder>raw;
}
export class OrderService extends Service {
    public async getAllOrders(): Promise<IOrder[]> {
        return (await this.get<IRawOrder[]>('/orders')).data.map(d => formatDates(d));
    }

    public async getOrder(id: string): Promise<IOrder> {
        return formatDates((await this.get<IRawOrder>(`/orders/${id}`)).data);
    }

    public async addOrder(order: IOrder): Promise<IOrder> {
        return formatDates((await this.post<IRawOrder>(`/orders`, order)).data);
    }

    public async updateOrder(order: IOrder): Promise<IOrder> {
        return formatDates((await this.put<IRawOrder>(`/orders`, order)).data);
    }

    public async deleteOrder(id: string): Promise<void> {
        await this.delete(`/orders/${id}`);
    }
}