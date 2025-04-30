export interface ICommission {
    id?: string;
    commission: number; 
    priceOver: number;
}

export interface ICommissionCategory {
    id?: string;
    salePlatformId: string;
    categoryId: string;
    commissionSizes?: ICommission[];
    inheritedSizes?: ICommission[];
}
