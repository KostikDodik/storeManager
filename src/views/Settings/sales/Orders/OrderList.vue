<script setup lang="ts">
import {computed, onBeforeMount, Ref, ref, toRaw, watch} from 'vue';
import {FilterMatchMode} from "primevue/api";
import {ISalePlatform} from "@/types/ISalePlatform";
import {IOrder} from "@/types/IOrder";
import {useRouter} from "vue-router";
import {useViewModel} from "@/stores/viewModel";
import {DataTableFilterMeta, DataTablePageEvent} from "primevue/datatable";
import {itemStateDisplayName, itemStateOptions} from "@/types/IItemState";
import {useConfirm} from "primevue/useconfirm";
import {ISupply} from "@/types/ISupply";
import {deleteOrder, getOrdersQuery} from "@/services/OrderService";
import {refreshProductsById} from "@/services/ProductService";
import {getSalePlatformsQuery} from "@/services/SalePlatformService";

interface IDisplayOrder extends IOrder {
    salePlatform?: ISalePlatform;
    stateName?: string;
    edited: Date;
}

const viewModel = useViewModel();
const router = useRouter();

const ordersQuery = getOrdersQuery();
const orders = ordersQuery.data;
const salePlatforms = getSalePlatformsQuery().data;

const displayOrders = computed(() => orders.value?.map(s => {
    const ds = structuredClone(toRaw(s) as IDisplayOrder);
    if (s?.salePlatformId) {
        ds.salePlatform = salePlatforms.value?.find(sup => sup.id === s.salePlatformId);
    }
    ds.stateName = itemStateDisplayName(s.state);
    ds.edited = ds.dateEdited?.getDateOnly();
    return ds;
}));

const loading = computed(() => ordersQuery.isLoading.value);

const editClick = (data: IOrder) => {
    router.push({
        name: "orders.edit",
        params: {id: data.id}
    })
};

const confirm = useConfirm();
const deleteClick = (data: IDisplayOrder) => {
    confirm.require({
        message: `Чи ви певні, що хочете видалити замовлення ${data.salePlatform?.name} №${data.number}`,
        header: "Видалити замовлення?",
        icon: 'fa fa-circle-exclamation',
        rejectProps: {
            label: "Cкасувати"
        },
        acceptProps: {
            label: "Видалити",
            severity: "danger"
        },
        defaultFocus: 'reject',
        accept: () => void (async(): Promise<void> => {
            await deleteOrder(data.id);
            if (data.rows?.length) {
                // updating available products count
                await refreshProductsById(data.rows.map(r => r.productId));
            }
        })()
    });
};

const addOrder = (data?: IOrder) => {
    router.push({
        name: "orders.create"
    });
};

const orderStates = ref(itemStateOptions.slice(1))

const pageChanged = (event: DataTablePageEvent) => {
    viewModel.orderListCurrentPage = event.page;
}
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
            v-model:filters="viewModel.orderFilters"
            paginator
            :rows="10"
            dataKey="id"
            filterDisplay="row"
            sortMode="multiple"
            v-model:multiSortMeta="viewModel.orderMultiSortMeta"
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
              <span @click="editClick(data)" style="cursor: pointer;">
                {{ data.salePlatform?.name }}                
              </span>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Select 
                  v-model="filterModel.value" 
                  filter
                  reset-filter-on-hide
                  reset-filter-on-clear
                  :options="salePlatforms" 
                  optionLabel="name" optionValue="id" 
                  @change="filterCallback()" 
                  placeholder="Торгова платформа" 
                  class="d-flex w-100"
              />
            </template>
          </Column>
          <Column field="number" header="П/н" headerStyle="width: 4em" sortable></Column>
          <Column field="edited" header="Остання зміна" headerStyle="width: 8em" sortable>
            <template #body="{ data }: { data: ISupply }">
              {{ data.dateEdited?.toUaTimeString() }}
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
                  :options="orderStates" 
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