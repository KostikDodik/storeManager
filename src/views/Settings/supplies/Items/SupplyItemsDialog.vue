<script setup lang="ts">
import {computed, ref, watch} from "vue";
import ItemsTable from "./ItemsTable.vue";
import {getItemsForSupplyQuery} from "@/services/ItemsService";

const props = defineProps<{
    supplyId?: string;
}>();

const display = ref(!!props.supplyId);
const emit = defineEmits(["close"]);

watch(() => display.value, () => {
    if (!display.value) {
        emit("close");
    }
});
watch(() => props.supplyId, () => {
    display.value = !!props.supplyId
});

const supplyId = computed(() => props.supplyId);
const itemsForSupplyQuery = getItemsForSupplyQuery(supplyId);
const supplyItems = itemsForSupplyQuery.data;
const itemsLoading = computed(() => itemsForSupplyQuery.isLoading.value || itemsForSupplyQuery.isFetching.value);

const ok = async (event: any) => {
    emit("close");
};
</script>

<template>
  <Dialog
    v-model:visible="display"
    modal
    :style="{width: '50rem'}"
    header="Вкажіть термін придатності"
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

