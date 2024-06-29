import {defineStore} from "pinia";
import {computed, ref} from "vue";

export const useViewModel = defineStore('viewModel', () => {
    const orderListCurrentPage = ref(0);
    const supplyListCurrentPage = ref(0);
    return { orderListCurrentPage, supplyListCurrentPage };
});
