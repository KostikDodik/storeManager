<script setup lang="ts">
import {computed, onBeforeMount, ref, watch} from "vue";
import {makeTreeSelectNodes} from "@/types/ICategory";
import {useCategoriesStore} from "@/stores/categories";
import {IProduct} from "@/types/IProduct";
import {TreeNode} from "primevue/treenode";
import {useProductsStore} from "@/stores/products";
import EditCategory from "../Categories/EditCategory.vue";
const categoryStore = useCategoriesStore();
const productStore = useProductsStore();
const props = defineProps<{
    product?: IProduct,
    display: boolean,
}>();
const product = ref(<IProduct>{});
const categorySelect = ref<{[key: string]: boolean}>({});
const categories = computed(() => makeTreeSelectNodes(categoryStore.categories));

const display = ref(false);
const emit = defineEmits(["close"]);
const editMode = computed(() => !!product?.value?.id)

watch(() => props.display, () => {
    display.value = props.display
    if (props.display) {
        fillProps();
    }
});

watch(() => display.value, () => {
    if (!display.value) {
        emit("close");
    }
});
const categorySelected = (category: TreeNode) => {
    if (category?.key) {
        product.value.categoryId = category.key;        
    }
}
const fillProps = () => {
    if (props.product) {
        product.value = <IProduct> { ...props.product };
        if (props.product.categoryId) {
            categorySelect.value = { [props.product?.categoryId]: true };
        }
        return;
    }
    let categoryId = Object.keys(categorySelect.value).find(key => categorySelect.value[key])
    product.value = <IProduct> { categoryId };
}

watch(() => props.product, fillProps);

const cancel = () => {
    product.value = <IProduct>{};
    emit("close");
};
const ok = async (event: any) => {
    event.preventDefault();
    if (editMode.value) {
        await productStore.update(product.value);        
    } else {
        await productStore.add(product.value);
    }
    emit("close", product.value.id);
    product.value = <IProduct>{};
};

const editCategoryDisplay = ref(false);
const onAddCategoryClick = () => {
    editCategoryDisplay.value = true;
}

const onEditCategoryClose = (id?: string) => {
    editCategoryDisplay.value = false;
    if (product.value && id) {
        product.value.categoryId = id;
        categorySelect.value = {[id]: true};
    }
}

onBeforeMount(() => {
    categoryStore.init();
    productStore.init();
    fillProps();
});
</script>

<template>
  <Dialog v-model:visible="display" modal :style="{width: '60rem'}" :header="editMode ? 'Редагувати найменування продукту' : 'Нове найменування продукту'">
    <form @submit="ok">
      <div class="form-group">
        <label for="name">Ім'я</label>
        <InputText id="name" v-model="product.name" required class="d-flex w-100"/>
      </div>
      <div class="form-group">
        <label for="categoryId">Категорія</label>
        <div class="w-100 d-flex justify-content-between">
          <TreeSelect 
              v-model="categorySelect" 
              :options="categories" 
              @node-select="categorySelected" 
              placeholder="Виберіть категорію" 
              class="d-flex w-100 me-2" 
              required 
          />
          <Button
              type="button" rounded
              icon="fa fa-plus"
              class="flex-shrink-0"
              v-tooltip="'Створити нову категорію'"
              @click="onAddCategoryClick"
          ></Button>
        </div>
      </div>
      <Accordion class="pt-2">
        <AccordionPanel key="settings" value="0">
          <AccordionHeader>Додаткові налаштування</AccordionHeader>
          <AccordionContent>
            <div class="form-group">
              <label for="code">Код</label>
              <InputText id="code" v-model="product.code" class="d-flex w-100"/>
            </div>
            <div class="form-group">
              <label for="buyPrice">Ціна покупки за замовчуванням</label>
              <InputNumber id="buyPrice" v-model="product.buyPrice" :minFractionDigits="2" :maxFractionDigits="2" class="d-flex w-100"/>
            </div>
            <div class="form-group">
              <label for="sellPrice">Ціна продажу за замовчуванням</label>
              <InputNumber id="sellPrice" v-model="product.sellPrice" :minFractionDigits="2" :maxFractionDigits="2" class="d-flex w-100"/>
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
      <div class="d-flex form-group justify-content-between">
        <Button icon="fa fa-cancel" label="Cancel" class="p-button-text" severity="warn" @click="cancel" />
        <Button icon="fa fa-check" label="Ok" class="p-button-text" type="submit" />
      </div>
    </form>
    <EditCategory :display="editCategoryDisplay" @close="onEditCategoryClose"></EditCategory>
  </Dialog>
</template>