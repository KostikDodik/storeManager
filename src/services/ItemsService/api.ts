import type {IItem} from "@/types/IItem";
import Service from "@/services/Service";

interface IRawItem extends Omit<IItem, 'updatedStatus'|'receivedDate'> {
    updatedStatus: Date | string;
    receivedDate: Date | string;
}

function formatDates(raw: IRawItem): IItem {
    raw.updatedStatus = raw.updatedStatus?.formatDate();
    raw.receivedDate = raw.receivedDate?.formatDate();
    return <IItem>raw;
}
export class ItemApi extends Service {
    public async getPage(productId?: string, onlyAvailable?: boolean, sortOrder?: number, page?: number): Promise<IItem[]> {
        let query = `/items?page=${page ?? 0}`;
        if (productId) {
            query += `&productId=${productId}`;
        }
        query += `&sortOrder=${sortOrder ?? 0}`;
        if (onlyAvailable !== undefined) {
            query += `&onlyAvailable=${onlyAvailable}`;
        }
        
        return (await this.get<IRawItem[]>(query)).data.map(d => formatDates(d));
    }

    public async getCount(productId?: string, onlyAvailable?: boolean): Promise<number> {
        let query = `/items/count`;
        if (productId) {
            query += `?productId=${productId}`;
        }
        if (onlyAvailable !== undefined) {
            query += `${productId ? "&" : "?"}onlyAvailable=${onlyAvailable}`;
        }
        return (await this.get<number>(query)).data;
    }
}