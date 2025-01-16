<script setup lang="ts">
import {computed, onBeforeMount, ref} from "vue";
import {ISupplyRow} from "@/types/ISupply";
import {IProduct} from "@/types/IProduct";
import EditProduct from "../Products/EditProduct.vue";
import {getAllProductsQuery} from "@/services/ProductService";

const productsQuery = getAllProductsQuery();
const products = productsQuery.data;

const props = defineProps<{
    deliveryDisabled: boolean
}>();

const rows = defineModel<ISupplyRow[]>("rows", {
    required: true
});
const addRow = () => {
    rows.value.splice(0, 0, <ISupplyRow>{});
}

const deleteClick = (row: ISupplyRow) => {
    rows.value.splice(rows.value.indexOf(row), 1);
}

const editProductDisplay = ref(false);
const editProduct = ref<IProduct>();
const currentRow = ref<ISupplyRow>();
const addProduct = (row: ISupplyRow) => {
  currentRow.value = row;
  editProduct.value = products.value?.find(p => p.id === row.productId)
  editProductDisplay.value = true;
};

const onProductModalClose = (id?: string) => {
    editProductDisplay.value = false;
    editProduct.value = undefined;
    if (currentRow.value && id) {
        currentRow.value.productId = id;
        onProductSelected(currentRow.value);
    }
}

const onProductSelected = (row: ISupplyRow) => {
    if (!row.supplyPrice && row.productId) {
        const product = products.value?.find(p => p.id === row.productId);
        if (product?.buyPrice) {
            row.supplyPrice = product.buyPrice;
        }
    }
    if (!row.count) {
        row.count = 1;
    }
}

const productsLoading = computed(() => productsQuery.isLoading.value);
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
              <div class="w-100 d-flex justify-content-between">
                <Select
                    v-model="data.productId"
                    filter
                    reset-filter-on-hide
                    reset-filter-on-clear
                    :options="products"
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Найменування"
                    class="flex-grow-1 flex-shrink-1 me-2"
                    required
                    :loading="productsLoading"
                    @change="() => onProductSelected(data)"
                />
                <Button
                    type="button" rounded
                    :icon="data.productId ? 'fa fa-edit' : 'fa fa-plus'"
                    v-tooltip="data.productId ? 'Редагувати товар' : 'Створити новий товар'"
                    :severity="data.productId ? 'warn' : 'success'"
                    class="flex-shrink-0"
                    @click="() => addProduct(data)"
                ></Button>             
              </div>                  
            </template>
          </Column>
          <Column field="supplyPrice" header="Ціна за одиницю" headerStyle="width: 10rem" >
            <template #body="{ data }">
              <InputNumber v-model="data.supplyPrice" :minFractionDigits="2" :maxFractionDigits="2" required></InputNumber>
            </template>
          </Column>
          <Column field="count" header="К-сть" headerStyle="width: 5rem">
            <template #body="{ data }">
              <InputNumber v-model="data.count" required></InputNumber>
            </template>
          </Column>
          <Column header="Загальна сума" headerStyle="width: 8rem">
            <template #body="{ data }">
              {{ Number((data.supplyPrice ?? 0) * (data.count ?? 0)).toFixed(2) }}
            </template>            
          </Column>
          <template v-if="!props.deliveryDisabled">
            <Column field="deliveryFee" header="Доставка (1 шт)" headerStyle="width: 8rem">
              <template #body="{ data }">
                <InputNumber v-model="data.deliveryPrice" :minFractionDigits="2" :maxFractionDigits="2" ></InputNumber>
              </template>
            </Column>
            <Column header="Загальна доставка" headerStyle="width: 8rem">
              <template #body="{ data }">
                {{ Number((data.deliveryPrice ?? 0) * (data.count ?? 0)).toFixed(2) }}
              </template>
            </Column>            
          </template>
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
    <EditProduct :display="editProductDisplay" @close="onProductModalClose" :product="editProduct"></EditProduct>
  </div>
</template>