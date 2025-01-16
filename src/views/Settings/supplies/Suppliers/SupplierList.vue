<script setup lang="ts">
import {computed, ref} from 'vue';
import {ISupplier} from "@/types/ISupplier";
import {FilterMatchMode} from "primevue/api";
import EditSupplier from "./EditSupplier.vue";
import {useConfirm} from "primevue/useconfirm";
import {deleteSupplier, getSuppliersQuery} from "@/services/SupplierService";

const suppliersQuery = getSuppliersQuery();
const suppliers = suppliersQuery.data;
const loading = computed(() => suppliersQuery.isLoading.value);

const filters = ref({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    code: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const currentSupplier = ref<ISupplier>();
const editSupplier = ref(false);
const editClick = (data: ISupplier) => {
    currentSupplier.value = data;
    editSupplier.value = true;
};
const closeEdit = () => {
    currentSupplier.value = undefined;
    editSupplier.value = false;
}

const confirm = useConfirm();
const deleteClick = (data: ISupplier) => {
    confirm.require({
        message: `Чи ви певні, що хочете видалити постачальника ${data.name}`,
        header: "Видалити постачальника?",
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
            await deleteSupplier(data.id);
        })()
    });
};
const addSupplier = () => {
    currentSupplier.value = <ISupplier>{};
    editSupplier.value = true;
};

</script>

<template>
  <div class="d-flex justify-content-center flex-auto overflow-y-scroll">
    <Card class="w-100 h-fit-content m-4" rounded>
      <template #header>
        <h3 class="bg-success-subtle pb-2 ps-3 pt-3">
          Постачальники:
        </h3>
      </template>
      <template #content>
        <div class="d-flex justify-content-end mb-2">
          <Button type="button" icon="fa-regular fa-plus" severity="success" @click="addSupplier" label="Додати постачальника"/>
        </div>
        <DataTable 
            :value="suppliers" 
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
        >
          <template #empty> Не знайдено найменувань продуктів </template>
          <template #loading> Завантаження найменувань.. </template>
          <Column field="name" header="Найменування" :showFilterMenu="false" sortable expander>
            <template #body="{ data }">
              {{ data.name }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="d-flex w-100" placeholder="Пошук по імені" />
            </template>
          </Column>
          <Column field="code" header="Код" headerStyle="width: 10rem" :showFilterMenu="false" sortable>
            <template #body="{ data }">
              {{ data.code }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="d-flex w-100" placeholder="Пошук по коду" />
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
        <EditSupplier :supplier="currentSupplier" :display="editSupplier" @close="closeEdit"></EditSupplier>
      </template>
    </Card>    
  </div>
</template>