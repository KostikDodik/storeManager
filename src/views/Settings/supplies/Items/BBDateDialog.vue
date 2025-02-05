<script setup lang="ts">
import {ref, watch} from "vue";
import {IItem} from "@/types/IItem";
import InputMask from 'primevue/inputmask';
import {updateBBDate} from "@/services/ItemsService";
import {twoDigits} from "@/utilities/date";

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
    await updateBBDate(props.items.map(i => i.id), new Date(Date.UTC(bbDate.value.getFullYear(), bbDate.value.getMonth(), bbDate.value.getDate())));
    emit("close");
    bbDate.value = undefined;
};

const toBbd = (dt?: Date): string => {
    if (!dt) {
         return "";
    }
    const currDate = twoDigits(dt.getDate());
    const curMonth = twoDigits(dt.getMonth() + 1); //Months are zero based
    const currYear = dt.getFullYear();
    return (currYear + "-" + curMonth + "-" + currDate);
}

watch(() => props.items, () => dateMask.value = toBbd(props.items?.[0]?.bbDate))

const dateMask = ref<string>(toBbd(props.items?.[0]?.bbDate));
watch(dateMask, () => {
    const splits = dateMask.value?.split("-");
    if (!splits) {
        return;
    }
    if (splits.length < 3) {
        return;
    }    
    bbDate.value = new Date(parseInt(splits[0]), parseInt(splits[1]) - 1, parseInt(splits[2]));
});

</script>

<template>
  <Dialog v-model:visible="display" modal :style="{width: '20rem'}" header="Вкажіть термін придатності">
    <form @submit="ok" v-if="items?.length">
      <div class="form-group">
        <InputMask v-model="dateMask" mask="9999-99-99" placeholder="рррр-мм-дд" slot-char="рррр-мм-дд" class="d-flex w-100" required />
      </div>
      <div class="d-flex pt-2 form-group justify-content-between">
        <Button icon="fa fa-cancel" label="Cancel" class="p-button-text" severity="warn" @click="cancel" />
        <Button icon="fa fa-check" label="Ok" class="p-button-text" type="submit" />
      </div>
    </form>
  </Dialog>
</template>

<style scoped>
.p-inputmask {
    width: 100% !important;
}
</style>
