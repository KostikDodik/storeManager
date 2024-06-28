<script setup lang="ts">
import {computed, onBeforeMount, ref} from 'vue';
import {FilterMatchMode} from "primevue/api";
import {useSuppliersStore} from "@/stores/suppliers";
import {useSuppliesStore} from "@/stores/supplies";
import {ISupplier} from "@/types/ISupplier";
import {ISupply} from "@/types/ISupply";
import {useRouter} from "vue-router";
import {supplyStateDisplayName, supplyStateOptions, SupplyState} from "@/types/ISupplyState";

interface IDisplaySupply extends ISupply {
    supplier?: ISupplier;
    stateName?: string;
}

const supplierStore = useSuppliersStore();
const supplyStore = useSuppliesStore();
const router = useRouter();

const supplies = computed(() => supplyStore.supplies);
const suppliers = computed(() => supplierStore.suppliers);

const displaySupplies = computed(() => supplies.value?.map(s => {
    const ds: IDisplaySupply = s;
    if (s?.supplierId) {
        ds.supplier = suppliers.value.find(sup => sup.id === s.supplierId);
    }
    ds.stateName = supplyStateDisplayName(s.state);
    return ds;
}));

const filters = ref({
    date: {value: null, matchMode: FilterMatchMode.EQUALS},
    updatedState: {value: null, matchMode: FilterMatchMode.EQUALS},
    supplierId: {value: null, matchMode: FilterMatchMode.EQUALS},
    state: { value: null, matchMode: FilterMatchMode.EQUALS}
});
const loading = ref(true);

const editClick = (data: ISupply) => {
    router.push({
        name: "supplies.edit",
        params: {id: data.id}
    })
};

const deleteClick = (data: ISupply) => {
    supplyStore.remove(data);
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

onBeforeMount(() => {
    supplierStore.init();
    supplyStore.init().then(() => loading.value = false);
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
            :row-class="rowClass"
        >
          <template #empty> Не знайдено поставок</template>
          <template #loading> Завантаження поставок..</template>
          <Column field="supplierId" header="Постачальник" :showFilterMenu="false" sortable>
            <template #body="{ data }">
              {{ data.supplier?.name }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Select 
                  v-model="filterModel.value" 
                  filter
                  :options="suppliers" 
                  optionLabel="name" 
                  optionValue="id" 
                  @change="filterCallback()" 
                  placeholder="Постачальник" 
                  class="d-flex w-100"
              />
            </template>
          </Column>
          <Column field="number" header="П/н" headerStyle="width: 4em"></Column>
          <Column field="trackingNumber" header="Номер ТТН" headerStyle="width: 15em"></Column>
          <Column field="state" header="Статус" headerStyle="width: 12rem" :showFilterMenu="false" sortable>
            <template #body="{ data }">
              {{ data.stateName }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <Select v-model="filterModel.value" editable :options="supplyStateOptions" optionLabel="name" optionValue="value" @change="filterCallback()" placeholder="Статус" class="d-flex w-100" />
            </template>
            
          </Column>
          <Column field="totalIncome" header="Дохід" headerStyle="width: 8rem">
            <template #body="{ data }">
              {{ Number(supplyStore.getSupplyIncome(data)).toFixed(2) }}
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