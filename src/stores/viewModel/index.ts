import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {FilterMatchMode} from "primevue/api";
import {DataTableFilterMeta, DataTableSortMeta} from "primevue/datatable";

export const useViewModel = defineStore('viewModel', () => {
    const orderListCurrentPage = ref(0);
    const supplyListCurrentPage = ref(0);
    const productsCurrentPage = ref(0);
    const orderFilters = ref<DataTableFilterMeta>();
    const orderMultiSortMeta = ref<DataTableSortMeta[]>([]);
    const clearOrderFilters = () => {
        orderFilters.value = {
            name: {value: null, matchMode: FilterMatchMode.CONTAINS},
            code: {value: null, matchMode: FilterMatchMode.CONTAINS},
            edited: {value: null, matchMode: FilterMatchMode.EQUALS},
            updatedState: {value: null, matchMode: FilterMatchMode.EQUALS},
            salePlatformId: {value: null, matchMode: FilterMatchMode.EQUALS},
            state: {value: null, matchMode: FilterMatchMode.EQUALS}
        };
        orderListCurrentPage.value = 0;
        orderMultiSortMeta.value = [];
    }
    const supplyFilters = ref<DataTableFilterMeta>();
    const supplyMultiSortMeta = ref<DataTableSortMeta[]>([]);
    const clearSupplyFilters = () => {
        supplyFilters.value = {
            date: {value: null, matchMode: FilterMatchMode.EQUALS},
            updatedState: {value: null, matchMode: FilterMatchMode.EQUALS},
            supplierId: {value: null, matchMode: FilterMatchMode.EQUALS},
            state: { value: null, matchMode: FilterMatchMode.EQUALS}
        };
        supplyListCurrentPage.value = 0;
        supplyMultiSortMeta.value = [];
    }
    clearOrderFilters();
    clearSupplyFilters();
    return { 
        orderListCurrentPage, supplyListCurrentPage, productsCurrentPage,
        orderFilters, clearOrderFilters, supplyFilters, clearSupplyFilters,
        supplyMultiSortMeta, orderMultiSortMeta
    };
});
