import type {IOrderState} from "./state";
import type {IOrder} from "@/types/IOrder";
import {OrderService} from "@/services/OrderService";
import type ICategoryState from "@/stores/categories/state";

const orderService = new OrderService();

export async function add(state: IOrderState, order: IOrder) {
    let newOrder = await orderService.addOrder(order);
    if (!await loadList(state)) {
        state.orders.value.push(newOrder);
    } 
    // Don't need to refresh as it was not initialised before and now is loaded with changes
}

export async function update(state: IOrderState, order: IOrder) {
    const updatedOrder = await orderService.updateOrder(order);
    if (!await loadList(state)) {
        let existingOrder = state.orders.value.find(cat => cat.id === updatedOrder.id);
        if (existingOrder != null) {
            Object.assign(existingOrder, updatedOrder);
        }
    }
    {
        let existingOrder = state.orderDictionary.value[updatedOrder.id];
        if (existingOrder) {
            Object.assign(existingOrder, updatedOrder);
        } else {
            state.orderDictionary.value[updatedOrder.id] = updatedOrder;
        }        
    }
}

export async function remove(state: IOrderState, order: IOrder) {
    await orderService.deleteOrder(order.id);
    if (await loadList(state)) {
        // Don't need to refresh as it was not initialised before and now is loaded with changes
        return;
    }
    
    const orders = state.orders.value;
    const index = orders.indexOf(order);
    if (index >= 0) {
        orders.splice(index, 1);
    }
}

export async function get(state: IOrderState, id: string) {
    let order = state.orderDictionary.value[id];
    if (!order) {
        order = await orderService.getOrder(id);
        state.orderDictionary.value[id] = order;
    }
    return order;
}

export async function getAll(state: IOrderState) {
    state.orders.value = await orderService.getAllOrders();
}

async function loadList(state: IOrderState): Promise<boolean> {
    if (state.orders.value?.length) {
        return false;
    }
    await getAll(state);
    return true;
}