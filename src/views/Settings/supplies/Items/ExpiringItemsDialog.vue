<script setup lang="ts">
import {computed, ref, watch} from "vue";
import ItemsTable from "./ItemsTable.vue";
import {getExpiringItemsQuery} from "@/services/ItemsService";

const display = ref(false);

const itemsForSupplyQuery = getExpiringItemsQuery();
const supplyItems = itemsForSupplyQuery.data;
const itemsLoading = computed(() => itemsForSupplyQuery.isLoading.value || itemsForSupplyQuery.isFetching.value);

const isMoreThanDayAgo = (dateString: string): boolean => {
    const lastDisplayDate = new Date(dateString);
    const currentDate = new Date();
    const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    return currentDate.getTime() - lastDisplayDate.getTime() > oneDayInMs;
};


const LOCAL_STORAGE_KEY = 'expiringItemsLastDisplayDate';
watch(supplyItems, () => {
    if (supplyItems.value?.length) {
        const lastDisplayDate = localStorage.getItem(LOCAL_STORAGE_KEY);

        // Show the dialog if there are items AND it's been more than a day since last display
        if (!lastDisplayDate || isMoreThanDayAgo(lastDisplayDate)) {
              display.value = !!supplyItems.value?.length;
            localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toISOString());
        }
    } else {
        display.value = false;
    }
});
const ok = async (event: any) => {
    display.value = false;
};
</script>

<template>
  <Dialog
    v-model:visible="display"
    modal
    class="modal-lg-width"
    :header="`Товари з критичним терміном придатності (${supplyItems?.length} од.)`"
    content-class="d-flex flex-column"
  >
    <div class="flex-grow-1 flex-shrink-1 overflow-auto">
      <ItemsTable v-if="!!supplyItems" :items="supplyItems" :items-loading="itemsLoading"/>
    </div>
    <div class="d-flex pt-2 form-group justify-content-end flex-grow-0">
      <Button icon="fa fa-check" label="Закінчити" class="p-button-text" type="button" @click="ok"/>
    </div>
  </Dialog>
</template>
