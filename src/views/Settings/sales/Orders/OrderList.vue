<script setup lang="ts">
import {computed, onBeforeMount, Ref, ref} from 'vue';
import {FilterMatchMode} from "primevue/api";
import {useSalePlatformsStore} from "@/stores/salePlatforms";
import {useOrdersStore} from "@/stores/orders";
import {ISalePlatform} from "@/types/ISalePlatform";
import {IOrder, stateDisplayName, stateOptions} from "@/types/IOrder";
import {useRouter} from "vue-router";
import {useViewModel} from "@/stores/viewModel";
import {DataTablePageEvent} from "primevue/datatable";

interface IDisplayOrder extends IOrder {
    salePlatform?: ISalePlatform;
    stateName?: string;
}

const salePlatformStore = useSalePlatformsStore();
const orderStore = useOrdersStore();
const viewModel = useViewModel();
const router = useRouter();

const orders = computed(() => orderStore.orders);
const salePlatforms = computed(() => salePlatformStore.salePlatforms);

const displayOrders = computed(() => orders.value?.map(s => {
    const ds: IDisplayOrder = s;
    if (s?.salePlatformId) {
        ds.salePlatform = salePlatforms.value.find(sup => sup.id === s.salePlatformId);
    }
    ds.stateName = stateDisplayName(s.state);
    return ds;
}));

const filters = ref({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    code: { value: null, matchMode: FilterMatchMode.CONTAINS },
    date: {value: null, matchMode: FilterMatchMode.EQUALS},
    updatedState: {value: null, matchMode: FilterMatchMode.EQUALS},
    salePlatformId: {value: null, matchMode: FilterMatchMode.EQUALS},
    state: { value: null, matchMode: FilterMatchMode.EQUALS}
});
const loading = ref(true);

const editClick = (data: IOrder) => {
    router.push({
        name: "orders.edit",
        params: {id: data.id}
    })
};

const deleteClick = (data: IOrder) => {
    orderStore.remove(data);
};
const addOrder = (data?: IOrder) => {
    router.push({
        name: "orders.create"
    });
};

const pageChanged = (event: DataTablePageEvent) => {
    viewModel.orderListCurrentPage = event.page;
}

onBeforeMount(() => {
    salePlatformStore.init();
    orderStore.init().then(() => loading.value = false);
});
</script>

<template>
  <div class="d-flex justify-content-center flex-auto overflow-y-scroll">
    <Card class="w-100 h-fit-content m-4" rounded>
      <template #header>
        <h3 class="bg-success-subtle pb-2 ps-3 pt-3">
          Список замовлень:
        </h3>
      </template>
      <template #content>
        <div class="d-flex justify-content-end mb-2">
          <Button type="button" icon="fa-regular fa-plus" severity="success" @click="() => addOrder()" label="Додати замовлення"/>
        </div>
        <DataTable
            :value="displayOrders"
            v-model:filters="filters"
            paginator
            :rows="10"
            dataKey="id"
            filterDisplay="row"
            sortMode="multiple"
            :loading="loading"
            removableSort
            stripedRows
            size="small"
            :first="10 * viewModel.orderListCurrentPage"
            @page="pageChanged"
        >
          <template #empty> Не знайдено замовлень</template>
          <template #loading> Завантаження замовлень..</template>
          <Column field="salePlatformId" header="Торгова платформа" :showFilterMenu="false" headerStyle="width: 15em" sortable>
            <template #body="{ data }">
              {{ data.salePlatform?.name }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Select 
                  v-model="filterModel.value" 
                  filter
                  :options="salePlatforms" 
                  optionLabel="name" optionValue="id" 
                  @change="filterCallback()" 
                  placeholder="Торгова платформа" 
                  class="d-flex w-100"
              />
            </template>
          </Column>
          <Column field="number" header="П/н" headerStyle="width: 4em"></Column>
          <Column field="date" header="Дата формування" :showFilterMenu="false" headerStyle="width: 11em" sortable>
            <template #body="{ data }">
              {{ data.date.toUaString() }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <DatePicker
                  v-model="filterModel.value"
                  dateFormat="dd/mm/yy"
                  class="d-flex w-100"
                  @update:modelValue="filterCallback()"
              />
            </template>
          </Column>
          <Column field="trackingNumber" header="Номер ТТН" headerStyle="width: 15em"></Column>
          <Column field="state" header="Статус" headerStyle="width: 6rem" :showFilterMenu="false" sortable>
            <template #body="{ data }">
              {{ data.stateName }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Select 
                  v-model="filterModel.value" 
                  editable :options="stateOptions" 
                  optionLabel="name" optionValue="value" 
                  @change="filterCallback()" 
                  placeholder="Статус" 
                  class="d-flex w-100"
              />
            </template>            
          </Column>
          <Column field="totalCheck" header="Сума" headerStyle="width: 6rem">
            <template #body="{ data }">
              {{ Number(data.totalCheck ?? 0).toFixed(2) }}
            </template>
          </Column>
          <Column field="totalIncome" header="Прибуток" headerStyle="width: 6rem">
            <template #body="{ data }">
              {{ Number(data.totalIncome ?? 0).toFixed(2) }}
            </template>
          </Column>
          <Column headerStyle="width: 0;" header="Дії">
            <template #body="slotProps">
              <div class="d-flex w-100 justify-content-between">
                <Button type="button" icon="fa fa-edit" rounded severity="warn" @click="() => editClick(slotProps.data)"/>
                <Button type="button" icon="fa-regular fa-trash-can" rounded severity="danger" @click="() => deleteClick(slotProps.data)"/>
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>