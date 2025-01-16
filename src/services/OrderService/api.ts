import type {IOrder} from "@/types/IOrder";
import Service from "@/services/Service";
import {IProduct} from "@/types/IProduct";

interface IRawOrder extends Omit<IOrder, 'date'|'updatedState'|'dateEdited'> {
    date: string | Date
    updatedState: string | Date,
    dateEdited: string | Date
}

function formatDates(raw: IRawOrder): IOrder {
    raw.date = raw.date?.formatDate();
    raw.updatedState = raw.updatedState?.formatDate();
    raw.dateEdited = raw.dateEdited?.formatDate();
    return <IOrder>raw;
}
export class OrderApi extends Service {
    public async getAllOrders(): Promise<IOrder[]> {
        return (await this.get<IRawOrder[]>('/orders')).data.map(d => formatDates(d));
    }

    public async getOrder(id?: string): Promise<IOrder> {
        return formatDates((await this.get<IRawOrder>(`/orders/${id}`)).data);
    }

    public async addOrder(order: IOrder): Promise<IOrder> {
        return formatDates((await this.post<IRawOrder>(`/orders`, order)).data);
    }

    public async updateOrder(order: IOrder): Promise<IOrder> {
        return formatDates((await this.put<IRawOrder>(`/orders`, order)).data);
    }

    public async deleteOrder(id: string): Promise<IProduct[]> {
        return (await this.delete<IProduct[]>(`/orders/${id}`)).data;
    }
}