import type {ISupply} from "@/types/ISupply";

export function calculateDeliveryFees(supply: ISupply) {
    if (!supply?.rows || !supply.deliveryFee) {
        return;
    }
    let valueWiseFractioningSize: number = 0;
    for (let row of supply.rows) {
        valueWiseFractioningSize += (row.count ?? 0) * (row.supplyPrice ?? 0);
    }
    if (!valueWiseFractioningSize) {
        return;
    }
    const fraction = supply.deliveryFee / valueWiseFractioningSize;
    supply.rows.forEach(row => {
        row.deliveryPrice = Math.round((row.supplyPrice ?? 0) * fraction * 100) / 100;
    });
}

export function getSupplySum(supply: ISupply): number {
    return supply?.rows?.reduce((partialSum, row) => partialSum + row.count * row.supplyPrice, 0) ?? 0;
}

export function getSupplyDeliveryFee(supply: ISupply): number {
    return supply?.rows?.reduce((partialSum, row) => partialSum + row.count * row.deliveryPrice, 0) ?? 0;
}

export function getSupplyCount(supply: ISupply): number {
    return supply?.rows?.reduce((partialSum, row) => partialSum + row.count, 0) ?? 0;
}

export function getSupplyIncome(supply: ISupply): number {
    return (supply?.soldMoney ?? 0) - getSupplySum(supply) - getSupplyDeliveryFee(supply);
}