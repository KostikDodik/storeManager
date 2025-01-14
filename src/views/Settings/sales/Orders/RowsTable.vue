<script setup lang="ts">
import {useProductsStore} from "@/stores/products";
import {computed, onBeforeMount, ref, watch} from "vue";
import {IOrderRow} from "@/types/IOrder";

const productStore = useProductsStore();
const products = computed(() => productStore.products);

const props = defineProps<{
    rows?: IOrderRow[]
}>();

const rows = computed(() => props.rows ?? []);
const initialCount = ref<{[key: string]: number}>({});

const addRow = () => {
    rows.value.splice(0, 0, <IOrderRow>{});
}

const deleteClick = (row: IOrderRow) => {
    rows.value.splice(rows.value.indexOf(row), 1);
}

const onProductSelected = (row: IOrderRow) => {
    if (!row.price && row.productId) {
        const product = products.value.find(p => p.id === row.productId);
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
        initialCount.value[row.productId] = row.quantity;
    }
}

watch(() => props.rows, () => fillInitialCount());

const productsLoading = ref(true);

onBeforeMount(() => {
    fillInitialCount();
    productStore.refresh().then(() => {
        productsLoading.value = false;
    })
});

const getAvailable = (row: IOrderRow): number => {
    if (!row.productId) {
        return 0;
    }
    const available = products.value?.find(p => p.id == row.productId)?.available ?? 0;
    const initial = initialCount.value[row.productId] ?? 0
    return initial + available;
};



</script>

<template>
  <div class="d-flex justify-content-center w-100" >
    <Card class="w-100" rounded>
      <template #header>
        <h3 class="bg-success-subtle pb-2 ps-3 pt-3">
          Найменування:
        </h3>
      </template>
      <template #content>
        <div class="d-flex justify-content-end mb-2">
          <Button type="button" icon="fa-regular fa-plus" severity="success" @click="() => addRow()" label="Додати найменування"/>
        </div>
        <DataTable
            :value="rows"
            paginator
            :rows="10"
            dataKey="id"
            stripedRows
            size="small"
        >
          <template #empty> Покищо немає найменувань</template>
          <Column field="productId" header="Найменування" >
            <template #body="{ data }" >
                <Select
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
          <Column header="Наявність" headerStyle="width: 5rem" >
            <template #body="{ data }">
              {{ getAvailable(data) + " шт." }}
            </template>
          </Column>
          <Column field="price" header="Ціна за одиницю" headerStyle="width: 10rem" >
            <template #body="{ data }">
              <InputNumber v-model="data.price" :minFractionDigits="2" :maxFractionDigits="2" required></InputNumber>
            </template>
          </Column>
          <Column field="count" header="К-сть" headerStyle="width: 5rem">
            <template #body="{ data }">
              <InputNumber v-model="data.quantity" required :min="0" :max="data.available"></InputNumber>
            </template>
          </Column>
          <Column header="Загальна сума" headerStyle="width: 8rem">
            <template #body="{ data }">
              {{ Number((data.price ?? 0) * (data.quantity ?? 0)).toFixed(2) }}
            </template>            
          </Column>
          <Column headerStyle="width: 4rem" header="Дії">
            <template #body="{ data }">
              <div class="d-flex w-100 justify-content-between">
                <Button type="button" icon="fa-regular fa-trash-can" rounded severity="danger" @click="() => deleteClick(data)"/>
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>