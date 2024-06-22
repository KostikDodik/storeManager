import type {ISupply} from "@/types/ISupply";
import Service from "@/services/Service";

interface IRawSupply extends Omit<ISupply, 'date'|'updatedState'> {
    date: string | Date
    updatedState: string | Date
}
function formatDates(raw: IRawSupply): ISupply {
    if (typeof raw.date === "string") {
        raw.date = new Date(raw.date);
    }
    if (typeof raw.updatedState === "string") {
        raw.updatedState = new Date(raw.updatedState);
    }
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