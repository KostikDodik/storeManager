<script setup lang="ts">
import {computed, onBeforeMount, Ref, ref} from 'vue';
import {useCategoriesStore} from "@/stores/categories";
import {IProduct} from "@/types/IProduct";
import EditProduct from './EditProduct.vue';
import {useProductsStore} from "@/stores/products";
import {ICategory, makeTreeSelectNodes} from "@/types/ICategory";
import {FilterMatchMode} from "primevue/api";
import {ColumnFilterModelType} from "primevue/column";
import {TreeNode} from "primevue/treenode";
import {useViewModel} from "@/stores/viewModel";
import {DataTablePageEvent} from "primevue/datatable";
import {useConfirm} from "primevue/useconfirm";

interface IDisplayProduct extends IProduct {
    category?: ICategory;
}

const categoryStore = useCategoriesStore();
const productStore = useProductsStore();
const products = computed(() => productStore.products);

const displayProducts = computed(() => products.value?.map(pr => {
    const dp: IDisplayProduct = pr;
    if (!pr?.categoryId) {
        return dp;
    }
    dp.category = categoryStore.flatCategories.find(c => c.id === pr.categoryId);
    return dp;
}));

const filters = ref({
    name: {value: null, matchMode: FilterMatchMode.CONTAINS},
    code: {value: null, matchMode: FilterMatchMode.CONTAINS},
    categoryId: {value: null, matchMode: FilterMatchMode.EQUALS}
});
const loading = ref(true);

const filterCategories = computed(() => makeTreeSelectNodes(categoryStore.categories));

const filterCategory = ref();
const filterByCategory = (filterCategory: TreeNode, filterModel: ColumnFilterModelType, filterCallback: Function) => {
    if (filterCategory?.key) {
        filterModel.value = filterCategory?.key;
    }
    filterCallback();
}

const currentProduct = ref<IProduct>();
const editProduct = ref(false);
const editClick = (data: IProduct) => {
    currentProduct.value = data;
    editProduct.value = true;
};
const closeEdit = () => {
    currentProduct.value = undefined;
    editProduct.value = false;
}

const confirm = useConfirm();
const deleteClick = (data: IProduct) => {
    confirm.require({
        message: `Чи ви певні, що хочете видалити найменування ${data.name}`,
        header: "Видалити найменування продукту?",
        icon: 'fa fa-circle-exclamation',
        rejectProps: {
            label: "Cкасувати"
        },
        acceptProps: {
            label: "Видалити",
            severity: "danger"
        },
        defaultFocus: 'reject',
        accept: () => void (async (): Promise<void> => {
            await productStore.remove(data);
        })()
    });
};
const addProduct = (data?: IProduct) => {
    currentProduct.value = <IProduct>{};
    editProduct.value = true;
};

onBeforeMount(() => {
    categoryStore.init();
    productStore.init().then(() => loading.value = false);
});

const viewModel = useViewModel();
const pageChanged = (event: DataTablePageEvent) => {
    viewModel.productsCurrentPage = event.page;
}

</script>

<template>
  <div class="d-flex justify-content-center flex-auto overflow-y-scroll">
    <Card class="w-100 h-fit-content m-4" rounded>
      <template #header>
        <h3 class="bg-success-subtle pb-2 ps-3 pt-3">
          Найменування продуктів:
        </h3>
      </template>
      <template #content>
        <div class="d-flex justify-content-end mb-2">
          <Button type="button" icon="fa-regular fa-plus" severity="success" @click="() => addProduct()" label="Додати найменування"/>
        </div>
        <DataTable
          :value="displayProducts"
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
          :first="10 * viewModel.supplyListCurrentPage"
          @page="pageChanged"
        >
          <template #empty> Не знайдено найменувань продуктів</template>
          <template #loading> Завантаження найменувань..</template>
          <Column field="name" header="Найменування" :showFilterMenu="false" sortable expander>
            <template #body="{ data }">
              <span @click="editClick(data)" style="cursor: pointer;">
                {{ data.name }}                
              </span>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="d-flex w-100" placeholder="Пошук по імені"/>
            </template>
          </Column>
          <Column field="code" header="Код" headerStyle="width: 10rem" :showFilterMenu="false" sortable>
            <template #body="{ data }">
              {{ data.code }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="d-flex w-100" placeholder="Пошук по коду"/>
            </template>
          </Column>
          <Column field="categoryId" header="Категорія" headerStyle="width: 10rem" :showFilterMenu="false" sortable>
            <template #body="{ data }">
              {{ data.category?.name }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <TreeSelect v-model="filterCategory" :options="filterCategories" @node-select="(node) => filterByCategory(node, filterModel, filterCallback)" class="d-flex w-100"
                          placeholder="Виберіть категорію"/>
            </template>
          </Column>
          <Column field="available" header="Наявність" headerStyle="width: 5rem" sortable>
            <template #body="{ data }">
              {{ data.available + " шт." }}
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
        <EditProduct :product="currentProduct" :display="editProduct" @close="closeEdit"></EditProduct>
      </template>
    </Card>
  </div>
</template>