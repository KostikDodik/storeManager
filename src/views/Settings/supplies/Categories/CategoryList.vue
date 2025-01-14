<script setup lang="ts">
import {computed, onBeforeMount, ref} from 'vue';
import {useCategoriesStore} from "@/stores/categories";
import {makeTreeNodes} from "@/types/ITreeNode";
import {ICategory} from "@/types/ICategory";
import EditCategory from './EditCategory.vue';
import {useConfirm} from "primevue/useconfirm";

const categoryStore = useCategoriesStore();
const categories = computed(() => categoryStore.categories);
const categoryTree = computed(() => makeTreeNodes<ICategory>(categories.value))

const currentCategory = ref<ICategory>();
const editCategory = ref(false);
const editClick = (data: ICategory) => {
    currentCategory.value = data;
    editCategory.value = true;
};
const closeEdit = () => {
    currentCategory.value = undefined;
    editCategory.value = false;
}

const confirm = useConfirm();
const deleteClick = (data: ICategory) => {
    confirm.require({
        message: `Чи ви певні, що хочете видалити поставку ${data.name}`,
        header: "Видалити категорію?",
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
            await categoryStore.remove(data);
        })()
    });    
};
const addChild = (data?: ICategory) => {
    currentCategory.value = <ICategory>{ parentId: data?.id };
    editCategory.value = true;
};

onBeforeMount(() => categoryStore.init());

</script>

<template>
  <div class="d-flex justify-content-center flex-auto overflow-y-scroll">
    <Card class="w-100 h-fit-content m-4" rounded>
      <template #header>
        <h3 class="bg-success-subtle pb-2 ps-3 pt-3">
          Категорії продуктів:
        </h3>
      </template>
      <template #content>
        <TreeTable :value="categoryTree" sortMode="multiple" removableSort>
          <Column field="name" header="Назва" sortable expander></Column>
          <Column field="code" header="Код" headerStyle="width: 10rem" sortable></Column>
          <Column headerStyle="width: 11rem" header="Дії">
            <template #body="slotProps">
              <div class="d-flex w-100 justify-content-between">
                <Button type="button" icon="fa fa-edit" rounded severity="warn" @click="() => editClick(slotProps.node.data)"/>
                <Button type="button" icon="fa-regular fa-trash-can" rounded severity="danger" @click="() => deleteClick(slotProps.node.data)"/>
                <Button type="button" icon="fa-regular fa-plus" rounded severity="success" @click="() => addChild(slotProps.node.data)"/>
              </div>
            </template>
          </Column>
          <template #footer>
            <div class="d-flex justify-content-end">
              <Button type="button" icon="fa-regular fa-plus" rounded severity="success" @click="() => addChild()"/>
            </div>
          </template>
        </TreeTable>
        <EditCategory :category="currentCategory" :display="editCategory" @close="closeEdit"></EditCategory>
      </template>
    </Card>    
  </div>
</template>