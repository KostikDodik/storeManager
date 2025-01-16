<script setup lang="ts">
import {computed, onBeforeMount, onMounted, ref, watch} from "vue";
import {ICategory, makeTreeSelectNodes} from "@/types/ICategory";
import {addCategory, getCategoriesQuery, updateCategory} from "@/services/CategoryService";
const props = defineProps<{
    category?: ICategory,
    display: boolean,
}>();

const categories = getCategoriesQuery().data;

const category = ref<ICategory>({});
const parentSelect = ref<{[key: string]: boolean}>({});
const parentCategories = computed(() => makeTreeSelectNodes(categories.value ?? []));

const display = ref(false);
const emit = defineEmits(["close"]);
const editMode = computed(() => !!category?.value?.id)

watch(() => props.display, () => {
    display.value = props.display
});

watch(() => display.value, () => {
    if (!display.value) {
        emit("close");
    }
});

const fillProps = () => {
    category.value = <ICategory> (props.category ? { ...props.category } : {});
    parentSelect.value = {};
    if (props.category?.parentId) {
        parentSelect.value[props.category.parentId] = true;
    }
}

watch(() => props.category, fillProps);

const cancel = () => {
    emit("close");
};
const ok = async (event: any) => {
    event.preventDefault();
    category.value.parentId = Object.keys(parentSelect.value).find(key => parentSelect.value[key]);
    if (editMode.value) {
        await updateCategory(category.value);
    } else {
        await addCategory(category.value);
    }
    emit("close", category.value.id);
    category.value = <ICategory>{};
};
onBeforeMount(() => {
    fillProps();
});
</script>

<template>
  <Dialog v-model:visible="display" modal :style="{width: '25rem'}" :header="editMode ? 'Редагувати категорію' : 'Нова категорія'">
    <form @submit="ok">
      <div class="form-group">
        <label for="name">Назва</label>
        <InputText id="name" v-model="category.name" required class="d-flex w-100"/>
      </div>
      <div class="form-group">
        <label for="code">Код</label>
        <InputText id="code" v-model="category.code" class="d-flex w-100"/>
      </div>
      <div class="form-group">
        <label for="parentId">Батьківська категорія</label>
        <TreeSelect v-model="parentSelect" :options="parentCategories" placeholder="Виберіть батьківську категорію" class="d-flex w-100" />
      </div>
      <div class="d-flex form-group justify-content-between">
      <Button icon="fa fa-cancel" label="Cancel" class="p-button-text" severity="warn" @click="cancel" />
      <Button icon="fa fa-check" label="Ok" class="p-button-text" type="submit" />
      </div>
    </form>
  </Dialog>
</template>
