import type {IDetailedSupply, ISupply} from "@/types/ISupply";
import Service from "@/services/Service";
import {IProduct} from "@/types/IProduct";
import {IDetailedDisplaySupply} from "@/types/ISupply";

interface IRawSupply extends Omit<ISupply, 'date'|'updatedState'|'dateEdited'> {
    date: string | Date
    updatedState: string | Date,
    dateEdited: string | Date
}

interface  IRawDetailedSupply extends Omit<IDetailedSupply, 'date'|'updatedState'|'dateEdited'> {
    date: string | Date
    updatedState: string | Date,
    dateEdited: string | Date
}

function formatDates<T>(raw: IRawSupply | IRawDetailedSupply): T {
    raw.date = raw.date?.formatDate();
    raw.updatedState = raw.updatedState?.formatDate();
    raw.dateEdited = raw.dateEdited?.formatDate();
    return <T>raw;
}
export class SupplyApi extends Service {
    public async getAllSupplies(): Promise<ISupply[]> {
        return (await this.get<IRawSupply[]>('/supplies')).data.map(d => formatDates(d));
    }

    public async getSupply(id?: string): Promise<IDetailedSupply> {
        return formatDates((await this.get<IRawDetailedSupply>(`/supplies/${id}`)).data);
    }

    public async addSupply(supply: ISupply): Promise<IDetailedSupply> {
        return formatDates((await this.post<IRawDetailedSupply>(`/supplies`, supply)).data);
    }

    public async updateSupply(supply: ISupply): Promise<IDetailedSupply> {
        return formatDates((await this.put<IRawDetailedSupply>(`/supplies`, supply)).data);
    }

    /*
    * Returns updated available products
    */
    public async deleteSupply(id: string): Promise<IProduct[]> {
        return (await this.delete<IProduct[]>(`/supplies/${id}`)).data;
    }
}