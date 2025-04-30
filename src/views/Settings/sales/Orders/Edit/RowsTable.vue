<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from "vue";
import { IOrderRow } from "@/types/IOrder";
import { getAllProductsQuery } from "@/services/ProductService";

const productsQuery = getAllProductsQuery();
const products = productsQuery.data;

const rows = defineModel<IOrderRow[]>("rows", {
    required: true
});
const initialCount = ref<{ [key: string]: number }>({});

const addRow = () => {
    rows.value.splice(0, 0, <IOrderRow>{});
}

const deleteClick = (row: IOrderRow) => {
    rows.value.splice(rows.value.indexOf(row), 1);
}

const onProductSelected = (row: IOrderRow) => {
    if (!row.price && row.productId) {
        const product = products.value?.find(p => p.id === row.productId);
        if (product?.sellPrice) {
            row.price = product.sellPrice;
        }
    }
    if (!row.quantity) {
        row.quantity = 1;
    }
}

const fillInitialCount = () => {
    initialCount.value = {};
    for (let row of rows.value) {
        initialCount.value[row.productId] = (initialCount.value[row.productId] ?? 0) + row.quantity;
    }
}

const productsLoading = computed(() => productsQuery.isLoading.value);

onBeforeMount(fillInitialCount);
watch(rows, fillInitialCount);


const getAvailable = (row: IOrderRow): number => {
    if (!row.productId) {
        return 0;
    }
    const available = products.value?.find(p => p.id == row.productId)?.available ?? 0;
    const initial = initialCount.value[row.productId] ?? 0
    return initial + available;
};

const showContent = ref(true);
const toggleContent = () => {
    showContent.value = !showContent.value;
}

</script>

<template>
  <div class="d-flex justify-content-end mb-2">
    <Button type="button" icon="fa-regular fa-plus" outlined severity="success" @click="() => addRow()"
            label="Додати найменування" />
  </div>
  <DataTable
    :value="rows"
    paginator
    :rows="10"
    dataKey="id"
    stripedRows
    size="small"
    :key="rows.length"
  >
    <template #empty> Покищо немає найменувань</template>
    <Column field="productId" header="Найменування">
      <template #body="{ data }">
        <span v-if="data.netSum">
          {{ products?.find(p => p.id === data.productId)?.name }}
        </span>
        <Select
          v-else
          v-model="data.productId"
          filter
          reset-filter-on-hide
          reset-filter-on-clear
          :options="products"
          optionLabel="name"
          optionValue="id"
          placeholder="Найменування"
          class="w-100 d-flex"
          required
          :loading="productsLoading"
          @change="() => onProductSelected(data)"
        />
      </template>
    </Column>
    <Column header="Наявність" headerStyle="width: 5rem">
      <template #body="{ data }">
        {{ getAvailable(data) + " шт." }}
      </template>
    </Column>
    <Column field="price" header="Ціна за одиницю" headerStyle="width: 10rem">
      <template #body="{ data }: { data: IOrderRow }">
        <span v-if="data.netSum">
          {{ data.netSum.toFixed(2) }}
        </span>
        <InputNumber
          v-else
          v-model="data.price"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          required
        />
      </template>
    </Column>
    <Column field="count" header="К-сть" headerStyle="width: 5rem">
      <template #body="{ data }">
        <span v-if="data.netSum">
          {{ data.quantity }}
        </span>
        <InputNumber 
          v-else 
          v-model="data.quantity" 
          required 
          :min="0" 
          :max="data.available"
        />
      </template>
    </Column>
    <Column header="Загальна сума" headerStyle="width: 8rem">
      <template #body="{ data }: { data: IOrderRow }">
        {{ Number(((data.netSum || data.price) ?? 0) * (data.quantity ?? 0)).toFixed(2) }}
      </template>
    </Column>
    <Column headerStyle="width: 4rem" header="Дії">
      <template #body="{ data }">
        <div class="d-flex w-100 justify-content-between">
          <Button 
            type="button" 
            icon="fa-regular fa-trash-can" 
            rounded
            outlined 
            severity="danger"                  
            @click="() => deleteClick(data)" />
        </div>
      </template>
    </Column>
  </DataTable>
</template>