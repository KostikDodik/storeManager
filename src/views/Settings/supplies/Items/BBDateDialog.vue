<script setup lang="ts">
import {ref, watch} from "vue";
import {IItem} from "@/types/IItem";
import {updateBBDate} from "@/services/ItemsService";

const props = defineProps<{
    items?: IItem[]
}>();

const display = ref(!!props.items?.length);
const bbDate = ref(props.items?.[0]?.bbDate)
const emit = defineEmits(["close"]);

watch(() => display.value, () => {
    if (!display.value) {
        emit("close");
    }
});
watch(() => props.items, () => {
    display.value = !!props.items?.length
});

const cancel = () => {
    emit("close");
};
const ok = async (event: any) => {
    event.preventDefault();
    if (!props.items?.length || !bbDate.value) {
        return;
    }
    await updateBBDate(props.items.map(i => i.id), new Date(Date.UTC(bbDate.value.getFullYear(), bbDate.value.getMonth(), 1)));
    emit("close");
    bbDate.value = undefined;
};
</script>

<template>
  <Dialog v-model:visible="display" modal :style="{width: '25rem'}" header="Вкажіть термін придатності">
    <form @submit="ok" v-if="items?.length">
      <div class="form-group">
        <DatePicker
          id="date" 
          v-model="bbDate" 
          breakpoint="400px" 
          date-format="mm/yy" 
          class="d-flex w-100"
          view="month"
          inline
          required
        />
      </div>
      <div class="d-flex pt-2 form-group justify-content-between">
        <Button icon="fa fa-cancel" label="Cancel" class="p-button-text" severity="warn" @click="cancel" />
        <Button icon="fa fa-check" label="Ok" class="p-button-text" type="submit" />
      </div>
    </form>
  </Dialog>
</template>
