<script setup lang="ts">
import Paginator from "primevue/paginator"
import {useViewModel} from "@/stores/viewModel";
import {computed, ref, toRaw, watch} from "vue";
import {getItemCountQuery, getItemPageQuery} from "@/services/ItemsService";
import {getAllProductsQuery} from "@/services/ProductService";
import {getOrdersQuery} from "@/services/OrderService";
import {getSuppliesQuery} from "@/services/SupplyService";
import {IItem} from "@/types/IItem";
import EditProduct from "@/views/Settings/supplies/Products/EditProduct.vue";
import {IProduct} from "@/types/IProduct";
import {getSuppliersQuery} from "@/services/SupplierService";
import {getSalePlatformsQuery} from "@/services/SalePlatformService";
import {IDisplayOrder} from "@/types/IOrder";
import {IDisplaySupply} from "@/types/ISupply";
import {useRouter} from "vue-router";

const viewModel = useViewModel();

const available = computed(() => viewModel.itemListOnlyAvailable);
const productId = computed(() => viewModel.itemListProductId);
const pageNumber = computed(() => viewModel.itemListCurrentPage);
const sortOrder = computed(() => viewModel.itemListOrder);

const countQuery = getItemCountQuery(productId, available);
const rawPageQuery = getItemPageQuery(productId, available, sortOrder, pageNumber);
const productsQuery = getAllProductsQuery();
const ordersQuery = getOrdersQuery();
const suppliesQuery = getSuppliesQuery();
const suppliersQuery = getSuppliersQuery();
const salePlatformsQuery = getSalePlatformsQuery();

const count = countQuery.data;
const rawPage = rawPageQuery.data;
const products = productsQuery.data;
const suppliers = suppliersQuery.data;
const salePlatforms = salePlatformsQuery.data;
const rawOrders = ordersQuery.data;
const rawSupplies = suppliesQuery.data;

const loading = computed(() => countQuery.isLoading.value || rawPageQuery.isLoading.value || productsQuery.isLoading.value || ordersQuery.isLoading.value 
    || suppliesQuery.isLoading.value || suppliersQuery.isLoading.value || salePlatformsQuery.isLoading.value
    || countQuery.isFetching.value || rawPageQuery.isFetching.value
);

const orders = computed(() => rawOrders.value?.map(ro => <IDisplayOrder>Object.assign(structuredClone(toRaw(ro)), {
    salePlatform: salePlatforms.value?.find(sp => sp.id === ro.salePlatformId)
})));
const supplies = computed(() => rawSupplies.value?.map(rs => <IDisplaySupply>Object.assign(structuredClone(toRaw(rs)), {
    supplier: suppliers.value?.find(s => s.id === rs.supplierId)
})));

const page = computed(() => rawPage.value?.map(rp => Object.assign(structuredClone(toRaw(rp)), {
    product: products.value?.find(p => p.id === rp.productId),
    order: orders.value?.find(o => o.id === rp.orderId),
    supply: supplies.value?.find(sup => sup.id === rp.supplyId)
})));

const pageNumberChanged = ({page}: { page: number }) => {
    viewModel.itemListCurrentPage = page;
}

const editProduct = ref<IProduct>();
const onProductModalClose = () => {
    editProduct.value = undefined;
}
const goToProduct = (item: IItem) => {
    editProduct.value = item?.product;
}
const router = useRouter();
const goToSupply = (event: MouseEvent, item: IItem) => {
    event.preventDefault();
    router.push({
        name: 'supplies.edit',
        params: { id: item.supplyId }
    });
}

const goToOrder = (event: MouseEvent, item: IItem) => {
    event.preventDefault();
    router.push({
        name: 'orders.edit',
        params: { id: item.orderId }
    });
}
const availableFilterText = computed(() => available.value !== undefined 
    ? available.value ? "В наявності" : "Продані" 
    : "Всі товари");

watch([available, productId], () => {
    viewModel.itemListCurrentPage = 0;
})
const changeAvailableFilter = () => {
    viewModel.itemListOnlyAvailable = available.value === undefined 
        ? true 
        : available.value
            ? false
            : undefined;
}
const receivedHeaderClick = () => {
    viewModel.itemListOrder = viewModel.itemListOrder === 0 ? 1 : 0;
}
const statusHeaderClick = () => {
    viewModel.itemListOrder = viewModel.itemListOrder === 2 ? 3 : 2;
}

</script>

<template>
  <div class="d-flex justify-content-center flex-auto overflow-y-scroll">
    <Card class="w-100 h-fit-content m-4" rounded>
      <template #header>
        <h3 class="bg-success-subtle pb-2 ps-3 pt-3">
          Одиниці товару:
        </h3>
      </template>
      <template #content>
        <DataTable
          :value="page"
          dataKey="id"
          filterDisplay="row"
          :loading="loading"
          stripedRows
        >
          <Column field="productId" header="Найменування" :show-filter-menu="false">
            <template #filter>
              <div class="d-flex justify-content-between">
                <Select
                  v-model="viewModel.itemListProductId"
                  filter
                  reset-filter-on-hide
                  reset-filter-on-clear
                  :options="products"
                  optionLabel="name" optionValue="id"
                  placeholder="Найменування"
                  class="d-flex flex-auto"
                />
                <Button 
                  v-if="!!viewModel.itemListProductId"
                  type="button" 
                  class="flex-grow-0" 
                  icon="fa fa-filter-circle-xmark" 
                  severity="secondary"
                  style="border-radius: 0 50% 50% 0"
                  @click="() => viewModel.itemListProductId = undefined"
                />
                <Button
                  type="button"
                  class="flex-grow-0 ms-2"
                  severity="secondary"
                  @click="changeAvailableFilter"
                >
                  {{ availableFilterText }}
                </Button>
              </div>
            </template>
            <template #body="{ data } : { data: IItem }">
              <a @click="() => goToProduct(data)" href="#">{{ data.product?.name }}</a>
            </template>
          </Column>
          <Column field="supplyId" header="Поставка" body-style="width: 12rem;">
            <template #body="{ data } : { data: IItem }">
              <a @click="event => goToSupply(event, data)" :href="`/supplies/${data.supplyId}`">{{ data.supply?.supplier?.name }} №{{data.supply?.number}}</a>
            </template>
          </Column>
          <Column header="Ціна закупки" body-style="width: 8rem">
            <template #body="{ data } : { data: IItem }">
              {{ (data.supplyPrice + data.deliveryPrice).toFixed(2) }}
            </template>
          </Column>
          <Column field="receivedDate" body-style="width: 8rem;">
            <template #header>
              <div @click="receivedHeaderClick">
                <b>Отримано</b>
                <i v-show="sortOrder === 0" class="ms-1 fa fa-arrow-up-wide-short"></i>
                <i v-show="sortOrder === 1" class="ms-1 fa fa-arrow-down-short-wide"></i>
              </div>
            </template>
            <template #body="{ data } : { data: IItem }">
              {{data.receivedDate?.toUaString()}}
            </template>
          </Column>
          <Column field="orderId" header="Замовлення" body-style="width: 12rem;" :show-filter-menu="false">
            <template #body="{ data } : { data: IItem }">
              <a 
                v-if="!!data.orderId" 
                @click="event => goToOrder(event, data)" 
                :href="`/orders/${data.orderId}`"
              >{{ data.order?.salePlatform?.name }} №{{data.order?.number}}</a>
              <span v-else>
                В наявності
              </span>
            </template>
          </Column>
          <Column header="Ціна продажу" body-style="width: 8rem">
            <template #body="{ data } : { data: IItem }">
              {{ data.orderId ? (data.salePrice).toFixed(2) : "" }}
            </template>
          </Column>
          <Column field="updatedStatus" body-style="width: 10rem">
            <template #header>
              <div @click="statusHeaderClick">
                <b>Статус змінено</b>
                <i v-show="sortOrder === 2" class="ms-1 fa fa-arrow-up-wide-short"></i>
                <i v-show="sortOrder === 3" class="ms-1 fa fa-arrow-down-short-wide"></i>
              </div>
            </template>
            <template #body="{ data } : { data: IItem }">
              {{ data.updatedStatus?.toUaTimeString() }}
            </template>
          </Column>
          <template #footer>
            <paginator
              :rows="10"
              :total-records="count"
              :first="viewModel.itemListCurrentPage * 10"
              @page="pageNumberChanged"
              template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="Показано позиції {first} - {last} з {totalRecords}"
            />
          </template>
        </DataTable>
      </template>
    </Card>
    <EditProduct :display="!!editProduct" @close="onProductModalClose" :product="editProduct"></EditProduct>
  </div>
</template>
