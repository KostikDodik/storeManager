<script setup lang="ts">
import {computed, ref, watch} from "vue";
import ItemsTable from "./ItemsTable.vue";
import {getExpiringItemsQuery} from "@/services/ItemsService";

const display = ref(false);

const itemsForSupplyQuery = getExpiringItemsQuery();
const supplyItems = itemsForSupplyQuery.data;
const itemsLoading = computed(() => itemsForSupplyQuery.isLoading.value || itemsForSupplyQuery.isFetching.value);

watch(supplyItems, () => display.value = !!supplyItems.value?.length);
const ok = async (event: any) => {
    display.value = false;
};
</script>

<template>
  <Dialog
    v-model:visible="display"
    modal
    :style="{width: '50rem'}"
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
