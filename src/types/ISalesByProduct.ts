export interface ISalesByProduct {
    name: string;
    categoryId: string;
    salesCount: number;
    income: number;
    netProfit: number;
    salesPercent: number;
    netProfitPercent: number;
}

export interface ISalesByCategory extends ISalesByProduct {
    id?: string;
    products: ISalesByProduct[];
    children: ISalesByCategory[];
}

