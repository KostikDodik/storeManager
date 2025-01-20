<script setup lang="ts">
import {computed, onBeforeMount, ref, watch} from "vue";
import {ISalePlatform} from "@/types/ISalePlatform";
import {addSalePlatform, updateSalePlatform} from "@/services/SalePlatformService";

const props = defineProps<{
    salePlatform?: ISalePlatform,
    display: boolean,
}>();

const salePlatform = ref(<ISalePlatform>{});

const display = ref(false);
const emit = defineEmits(["close"]);
const editMode = computed(() => !!salePlatform?.value?.id)

watch(() => props.display, () => {
    display.value = props.display
});

watch(() => display.value, () => {
    if (!display.value) {
        emit("close");
    }
});

const fillProps = () => {
    salePlatform.value = <ISalePlatform> { ...(props.salePlatform ?? {}) };
}

watch(() => props.salePlatform, fillProps);

const cancel = () => {
    emit("close");
};
const ok = async (event: any) => {
    event.preventDefault();
    let res: ISalePlatform;
    if (editMode.value) {
        res = await updateSalePlatform(salePlatform.value);        
    } else {
        res = await addSalePlatform(salePlatform.value);
    }    
    emit("close", res.id);
    salePlatform.value = <ISalePlatform>{};
};
onBeforeMount(() => {
    fillProps();
});
</script>

<template>
  <Dialog v-model:visible="display" modal :style="{width: '25rem'}" :header="editMode ? 'Редагувати торгову платформу' : 'Нова торгова платформа'">
    <form @submit="ok">
      <div class="form-group">
        <label for="name">Ім'я</label>
        <InputText id="name" v-model="salePlatform.name" required class="d-flex w-100"/>
      </div>
      <div class="form-group">
        <label for="code">Код</label>
        <InputText id="code" v-model="salePlatform.code" class="d-flex w-100"/>
      </div>
      <div class="d-flex form-group justify-content-between">
        <Button icon="fa fa-cancel" label="Cancel" class="p-button-text" severity="warn" @click="cancel" />
        <Button icon="fa fa-check" label="Ok" class="p-button-text" type="submit" />
      </div>
    </form>
  </Dialog>
</template>