<script setup lang="ts">
import {computed, onBeforeMount, ref, watch} from "vue";
import {ISupplier} from "@/types/ISupplier";
import {useSuppliersStore} from "@/stores/suppliers";

const supplierStore = useSuppliersStore();
const props = defineProps<{
    supplier?: ISupplier,
    display: boolean,
}>();

const supplier = ref(<ISupplier>{});

const display = ref(false);
const emit = defineEmits(["close"]);
const editMode = computed(() => !!supplier?.value?.id)

watch(() => props.display, () => {
    display.value = props.display
});

watch(() => display.value, () => {
    if (!display.value) {
        emit("close");
    }
});

const fillProps = () => {
    supplier.value = <ISupplier> (props.supplier ? { ...props.supplier } : {});
}

watch(() => props.supplier, fillProps);

const cancel = () => {
    emit("close");
};
const ok = async (event: any) => {
    event.preventDefault();
    if (editMode.value) {
        await supplierStore.update(supplier.value);        
    } else {
        await supplierStore.add(supplier.value);
    }    
    emit("close", supplier.value.id);
    supplier.value = <ISupplier>{};
};
onBeforeMount(() => {
    supplierStore.init();
    fillProps();
});
</script>

<template>
  <Dialog v-model:visible="display" modal :style="{width: '25rem'}" :header="editMode ? 'Редагувати постачальника' : 'Новий постачальник'">
    <form @submit="ok">
      <div class="form-group">
        <label for="name">Ім'я</label>
        <InputText id="name" v-model="supplier.name" required class="d-flex w-100"/>
      </div>
      <div class="form-group">
        <label for="code">Код</label>
        <InputText id="code" v-model="supplier.code" class="d-flex w-100"/>
      </div>
      <div class="d-flex form-group justify-content-between">
        <Button icon="fa fa-cancel" label="Cancel" class="p-button-text" severity="warn" @click="cancel" />
        <Button icon="fa fa-check" label="Ok" class="p-button-text" type="submit" />
      </div>
    </form>
  </Dialog>
</template>