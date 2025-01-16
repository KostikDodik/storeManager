<script setup lang="ts">
import {computed, onBeforeMount, Ref, ref} from 'vue';
import {ISalePlatform} from "@/types/ISalePlatform";
import {FilterMatchMode} from "primevue/api";
import EditSalePlatform from "./EditSalePlatform.vue";
import {deleteSalePlatform, getSalePlatformsQuery} from "@/services/SalePlatformService";

const salePlatformsQuery = getSalePlatformsQuery();
const salePlatforms = salePlatformsQuery.data;

const filters = ref({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    code: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const loading = computed(() => salePlatformsQuery.isLoading.value);

const currentSalePlatform = ref<ISalePlatform>();
const editSalePlatform = ref(false);
const editClick = (data: ISalePlatform) => {
    currentSalePlatform.value = data;
    editSalePlatform.value = true;
};
const closeEdit = () => {
    currentSalePlatform.value = undefined;
    editSalePlatform.value = false;
}
const deleteClick = (data: ISalePlatform) => {
    deleteSalePlatform(data.id);
};
const addSalePlatform = () => {
    currentSalePlatform.value = <ISalePlatform>{};
    editSalePlatform.value = true;
};

</script>

<template>
  <div class="d-flex justify-content-center flex-auto">
    <Card class="w-75" rounded>
      <template #header>
        <h3 class="bg-success-subtle pb-2 ps-3 pt-3">
          Торгові платформи:
        </h3>
      </template>
      <template #content>
        <div class="d-flex justify-content-end mb-2">
          <Button type="button" icon="fa-regular fa-plus" severity="success" @click="addSalePlatform" label="Add SalePlatform"/>
        </div>
        <DataTable 
            :value="salePlatforms" 
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
          <template #empty> Не знайдено торгових платформ </template>
          <template #loading> Завантаження списку платформ.. </template>
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
        <EditSalePlatform :salePlatform="currentSalePlatform" :display="editSalePlatform" @close="closeEdit"></EditSalePlatform>
      </template>
    </Card>    
  </div>
</template>