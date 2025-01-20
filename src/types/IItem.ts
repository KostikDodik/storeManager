import {ItemState} from "./IItemState";
import {IDisplayOrder} from "./IOrder";
import {IProduct} from "./IProduct";
import {IDisplaySupply} from "./ISupply";

export interface IItem {
    id: string;
    updatedStatus: Date;
    receivedDate: Date;
    productId: string;
    product?: IProduct;
    supplyId: string;
    supply?: IDisplaySupply;
    orderId?: string;
    order?: IDisplayOrder;
    state: ItemState;
    supplyPrice: number;
    deliveryPrice: number;
    salePrice: number;
}