import type {ISupply} from "@/types/ISupply";
import Service from "@/services/Service";

interface IRawSupply extends Omit<ISupply, 'date'|'updatedState'|'dateEdited'> {
    date: string | Date
    updatedState: string | Date,
    dateEdited: string | Date
}
function formatDates(raw: IRawSupply): ISupply {
    raw.date = raw.date?.formatDate();
    raw.updatedState = raw.updatedState?.formatDate();
    raw.dateEdited = raw.dateEdited?.formatDate();
    return <ISupply>raw;
}
export class SupplyService extends Service {
    public async getAllSupplies(): Promise<ISupply[]> {
        return (await this.get<IRawSupply[]>('/supplies')).data.map(d => formatDates(d));
    }

    public async getSupply(id: string): Promise<ISupply> {
        return formatDates((await this.get<IRawSupply>(`/supplies/${id}`)).data);
    }

    public async addSupply(supply: ISupply): Promise<ISupply> {
        return formatDates((await this.post<IRawSupply>(`/supplies`, supply)).data);
    }

    public async updateSupply(supply: ISupply): Promise<ISupply> {
        return formatDates((await this.put<IRawSupply>(`/supplies`, supply)).data);
    }

    public async deleteSupply(id: string): Promise<void> {
        await this.delete(`/supplies/${id}`);
    }
}