<script setup lang="ts">
import {computed, onBeforeMount, ref, watch} from "vue";
import {useCategoriesStore} from "@/stores/categories";
import {ISalePlatform} from "@/types/ISalePlatform";
import {useSalePlatformsStore} from "@/stores/salePlatforms";

const salePlatformStore = useSalePlatformsStore();
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
    salePlatform.value = <ISalePlatform> (props.salePlatform ? { ...props.salePlatform } : {});
}

watch(() => props.salePlatform, fillProps);

const cancel = () => {
    emit("close");
};
const ok = async (event: any) => {
    event.preventDefault();
    if (editMode.value) {
        await salePlatformStore.update(salePlatform.value);        
    } else {
        await salePlatformStore.add(salePlatform.value);
    }    
    emit("close", salePlatform.value.id);
    salePlatform.value = <ISalePlatform>{};
};
onBeforeMount(() => {
    salePlatformStore.init();
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