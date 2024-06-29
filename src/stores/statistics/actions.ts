import type {IStatisticsState} from "./state";
import {StatisticsService} from "@/services/StatisticsService";
import {ISalesByCategory, ISalesByProduct} from "@/types/ISalesByProduct";
import {ICategory} from "@/types/ICategory";
import {ITreeNode, makeTreeNodes} from "@/types/ITreeNode";
const statisticsService = new StatisticsService();

async function loadRawData(state: IStatisticsState, start?: Date, end?: Date): Promise<ISalesByProduct[]> {
    let cache = state.raw.value[keyFromDate(start)]?.[keyFromDate(end)];
    if (cache) {
        return cache;
    }
    
    cache = await statisticsService.getSalesByProduct(start, end);
    state.raw.value[keyFromDate(start)] = {
        ...state.raw.value[keyFromDate(start)],
        [keyFromDate(end)]: cache,
    };
    return cache;
}

export async function getFormatedData(state: IStatisticsState, start?: Date, end?: Date): Promise<ITreeNode<ISalesByCategory>[]> {
    let cache = state.formated.value[keyFromDate(start)]?.[keyFromDate(end)];
    if (cache) {
        return cache;
    }
    const rawData = await loadRawData(state, start, end);
    const tree = calculateSalesByCategory(rawData, state.categories.value) ?? [];
    const titleCategory = <ISalesByCategory>{
        id: "",
        name: "Загалом",
        categoryId: "",
        children: tree,
        salesPercent: 100,
        netProfitPercent: 100
    };
    titleCategory.salesCount = sumCategory(titleCategory, product => product.salesCount);
    titleCategory.income = sumCategory(titleCategory, product => product.income);
    titleCategory.netProfit = sumCategory(titleCategory, product => product.netProfit);
    cache = [{
        key: "", 
        data: titleCategory,
        children: makeTreeNodes(tree) ?? []
    }];
    state.formated.value[keyFromDate(start)] = {
        ...state.formated.value[keyFromDate(start)],
        [keyFromDate(end)]: cache,
    };
    return cache;
}

function keyFromDate(dt?: Date): string {
    return dt?.toDateString() ?? "";
}

function sumValues(items: ISalesByProduct[], valueAccessor: (item: ISalesByProduct) => number): number {
    return items?.reduce((result, item) => result + valueAccessor(item), 0) ?? 0;
}
function sumCategory(item: ISalesByCategory, valueAccessor: (item: ISalesByProduct) => number): number {
    return sumValues(item.products, valueAccessor) + sumValues(item.children, valueAccessor);
}

function calculateSalesByCategory(byProduct: ISalesByProduct[], categoryTree?: ICategory[], totalSales?: number, totalNet?: number): ISalesByCategory[] | undefined {
    if (!categoryTree) {
        return;
    }
    totalSales ??= sumValues(byProduct, product => product.salesCount);
    totalNet ??= sumValues(byProduct, product => product.netProfit);
    const salesByCategory: ISalesByCategory[] = [];
    for (const category of categoryTree) {
        const item = <ISalesByCategory> {
            id: category.id,
            name: category.name,
            categoryId: category.id,
            products: byProduct.filter(p => p.categoryId === category.id),
            children: calculateSalesByCategory(byProduct, category.children, totalSales, totalNet)
        };

        item.salesCount = sumCategory(item, product => product.salesCount); 
        item.income = sumCategory(item, product => product.income);
        item.netProfit = sumCategory(item, product => product.netProfit);
        item.salesPercent = totalSales && ((item.salesCount / totalSales) * 100);
        item.netProfitPercent = totalNet && ((item.netProfit / totalNet) * 100);

        salesByCategory.push(item);
    }
    return salesByCategory;
}

export async function getSupplyStatistics(state: IStatisticsState, start?: Date, end?: Date) {
    let cache = state.supplyStats.value[keyFromDate(start)]?.[keyFromDate(end)];
    if (!cache) {
        cache = await statisticsService.getSupplyStatistics(start, end);
        state.supplyStats.value[keyFromDate(start)] = {
            ...state.supplyStats.value[keyFromDate(start)],
            [keyFromDate(end)]: cache,
        };
    }
    return cache;
}