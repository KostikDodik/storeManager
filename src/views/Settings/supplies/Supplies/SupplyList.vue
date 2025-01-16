<script setup lang="ts">
import {computed, ref, toRaw, watch} from 'vue';
import {ISupplier} from "@/types/ISupplier";
import {ISupply} from "@/types/ISupply";
import {useRouter} from "vue-router";
import {SupplyState, supplyStateDisplayName, supplyStateOptions} from "@/types/ISupplyState";
import {useViewModel} from "@/stores/viewModel";
import {DataTablePageEvent} from "primevue/datatable";
import {useConfirm} from "primevue/useconfirm";
import {getSuppliersQuery} from "@/services/SupplierService";
import {deleteSupply, getSuppliesQuery} from "@/services/SupplyService";
import {getSupplyIncome} from "./calculations";

interface IDisplaySupply extends ISupply {
    supplier?: ISupplier;
    stateName?: string;
}

const viewModel = useViewModel();
const router = useRouter();

const suppliesQuery = getSuppliesQuery();
const supplies = suppliesQuery.data;

const suppliersQuery = getSuppliersQuery();
const suppliers = suppliersQuery.data;
const loading = computed(() => suppliesQuery.isLoading.value || suppliesQuery.isLoading.value);

const displaySupplies = computed(() => supplies.value?.map(s => {
    const ds: IDisplaySupply = structuredClone(toRaw(s));
    if (s?.supplierId) {
        ds.supplier = suppliers.value?.find(sup => sup.id === s.supplierId);
    }
    ds.stateName = supplyStateDisplayName(s.state);
    return ds;
}));

const editClick = (data: ISupply) => {
    router.push({
        name: "supplies.edit",
        params: {id: data.id}
    })
};
const confirm = useConfirm();
const deleteClick = (data: IDisplaySupply) => {
    confirm.require({
        message: `Чи ви певні, що хочете видалити поставку ${data.supplier?.name} №${data.number}`,
        header: "Видалити поставку?",
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
            await deleteSupply(data.id);
        })()
    });
};

const addSupply = () => {
    router.push({
        name: "supplies.create"
    });
};

const rowClass = (data: string | IDisplaySupply | undefined) => {
    if (!data || typeof(data) === "string") {
        return;
    }
    return [{ 'bg-success-subtle': data.state === SupplyState.SoldOut }];
};

const pageChanged = (event: DataTablePageEvent) => {
    viewModel.supplyListCurrentPage = event.page;
}

const renderKey = ref(0);
watch(supplies, () => {
    renderKey.value++
}, {
    deep: true
});

</script>

<template>
  <div class="d-flex justify-content-center flex-auto overflow-y-scroll">
    <Card class="w-100 h-fit-content m-4" rounded>
      <template #header>
        <h3 class="bg-success-subtle pb-2 ps-3 pt-3">
          Список поставок:
        </h3>
      </template>
      <template #content>
        <div class="d-flex justify-content-end mb-2">
          <Button type="button" icon="fa-regular fa-plus" severity="success" @click="() => addSupply()" label="Додати поставку"/>
        </div>
        <DataTable
            :value="displaySupplies"
            v-model:filters="viewModel.supplyFilters"
            :key="renderKey"
            paginator
            :rows="10"
            dataKey="id"
            filterDisplay="row"
            sortMode="multiple"
            v-model:multiSortMeta="viewModel.supplyMultiSortMeta"
            :loading="loading"
            removableSort
            stripedRows
            size="small"
            :row-class="rowClass"
            :first="10 * viewModel.supplyListCurrentPage"
            @page="pageChanged"
        >
          <template #empty> Не знайдено поставок</template>
          <template #loading> Завантаження поставок..</template>
          <Column field="supplierId" header="Постачальник" :showFilterMenu="false" sortable>
            <template #body="{ data }">
              <span @click="editClick(data)" style="cursor: pointer;">
                {{ data.supplier?.name }}                
              </span>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Select 
                  v-model="filterModel.value" 
                  filter
                  reset-filter-on-hide
                  reset-filter-on-clear
                  :options="suppliers" 
                  optionLabel="name" 
                  optionValue="id" 
                  @change="filterCallback()" 
                  placeholder="Постачальник" 
                  class="d-flex w-100"
              />
            </template>
          </Column>
          <Column field="number" header="П/н" headerStyle="width: 4em" sortable></Column>
          <Column field="dateEdited" header="Остання зміна" headerStyle="width: 10em" sortable>
            <template #body="{ data }: { data: ISupply }">
              {{ data.dateEdited?.toUaTimeString() }}
            </template>
          </Column>
          <Column field="state" header="Статус" headerStyle="width: 12rem" :showFilterMenu="false" sortable>
            <template #body="{ data }">
              {{ data.stateName }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Select 
                v-model="filterModel.value" 
                editable 
                :options="supplyStateOptions" 
                optionLabel="name" 
                optionValue="value" 
                @change="filterCallback()" 
                placeholder="Статус" 
                class="d-flex w-100" 
              />
            </template>            
          </Column>
          <Column field="updatedState" header="Статус оновлено" headerStyle="width: 8em" sortable>
            <template #body="{ data }: { data: ISupply }">
              {{ data.updatedState?.toLocaleDateString() }}
            </template>
          </Column>
          <Column field="totalIncome" header="Дохід" headerStyle="width: 8rem">
            <template #body="{ data }">
              {{ Number(getSupplyIncome(data)).toFixed(2) }}
            </template>
          </Column>
          <Column headerStyle="width: 8rem" header="Дії">
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