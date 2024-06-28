<script setup lang="ts">
import {computed, onBeforeMount, ref, watch} from "vue";
import {IOrder} from "@/types/IOrder";
import {useOrdersStore} from "@/stores/orders";
import {useRoute, useRouter} from "vue-router";
import {useSalePlatformsStore} from "@/stores/salePlatforms";
import RowsTable from "./RowsTable.vue";
import EditSalePlatform from "../SalePlatforms/EditSalePlatform.vue";
import {useProductsStore} from "@/stores/products";
import {ItemState, itemStateOptions} from "@/types/IItemState";

const orderStore = useOrdersStore();
const productStore = useProductsStore();
const salePlatformStore = useSalePlatformsStore();
const props = defineProps<{
    orderId?: string
}>();
const route = useRoute();
const orderId = computed(() => <string>route.params.id || props.orderId);
const originalOrder = ref(<IOrder>{});

const loadOrders = async () => {
    if (!orderId.value) {
        return;
    }
    originalOrder.value = await orderStore.get(orderId.value);
    await orderStore.init();
}
watch(() => orderId.value, loadOrders);
const editMode = computed(() => !!originalOrder?.value?.id);
const orderStates = ref(itemStateOptions.slice(1));

const order = ref(<IOrder>{});
const fillProps = () => {
    order.value = <IOrder> (originalOrder.value ? { ...originalOrder.value } : {});
    order.value.rows = (!order.value.rows ? [] : order.value.rows.map(row => ({ ...row })));
    order.value.state = order.value.state || ItemState.Ordered;
}

watch(() => orderId.value, fillProps);
watch(() => originalOrder.value, fillProps);
const salePlatforms = computed(() => salePlatformStore.salePlatforms);

const router = useRouter();
const ok = (event: any) => {
    event.preventDefault();
    if (editMode.value) {
        orderStore.update(order.value).then(() => {
            if (order.value.rows?.length) {
              // updating available products count
              productStore.refresh(order.value.rows.map(r => r.productId));    
            }            
            router.back();
        });        
    } else {
        orderStore.add(order.value).then(() => {
            if (order.value.rows?.length) {
                // updating available products count
                productStore.refresh(order.value.rows.map(r => r.productId));
            }
            router.back();
        });
    }
};
const cancel = () => {
    router.back();
}

const salePlatformsLoading = ref(true);
const editSalePlatformDisplay = ref(false);
const onAddSalePlatformClick = () => editSalePlatformDisplay.value = true;
const onEditSalePlatformClose = (id?: string) => {
    editSalePlatformDisplay.value = false;
    if (order.value && id) {
        order.value.salePlatformId = id;
    }
}

const currentSalePlatform = computed(() => salePlatforms.value.find(p => p.id === order.value.salePlatformId)?.name);

onBeforeMount(() => {
    salePlatformStore.init().then(() => salePlatformsLoading.value = false);
    loadOrders();
    fillProps();
});
</script>

<template>
  <div class="d-flex justify-content-center flex-auto overflow-y-scroll">
    <Card class="w-100 h-fit-content m-4" rounded>
      <template #header>
        <h3 class="bg-success-subtle pb-2 ps-3 pt-3">
          {{editMode ? `Редагувати замовлення з платформи ${currentSalePlatform ?? ""} №${order.number}` : "Створити замовлення" }}
        </h3>
      </template>
      <template #content>
        <form @submit="ok" >          
          <div class="row mb-3">
            <div class="form-group col-6">
              <label for="salePlatform">Торгова платформа</label>
              <div class="w-100 d-flex justify-content-between">
                <Select
                    v-model="order.salePlatformId"
                    :options="salePlatforms"
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Торгова платформа"
                    class="d-flex w-100 me-2"
                    id="salePlatform"
                    :loading="salePlatformsLoading"
                />
                <Button
                    type="button" rounded
                    icon="fa fa-plus"
                    class="flex-shrink-0"
                    v-tooltip="'Створити нову торгову платформу'"
                    @click="onAddSalePlatformClick"
                ></Button>
              </div>
            </div>
            <div class="form-group col-6">
              <label for="date">Дата створення замовлення</label>
              <DatePicker id="date" v-model="order.date" breakpoint="400px" date-format="dd/mm/yy" class="d-flex w-100"/>
            </div>
          </div>
          <div class="row mb-3" v-if="editMode">
            <div class="form-group col-6">
              <label for="state">Статус</label>
              <Select 
                  v-model="order.state" 
                  :options="orderStates" 
                  optionLabel="name" 
                  optionValue="value" 
                  placeholder="Статус" 
                  class="d-flex w-100"
                  id="state"
              />              
            </div>
            <div class="form-group col-6">
              <label for="updatedState">Статус оновлено </label>
              <DatePicker id="updatedState" v-model="order.updatedState" breakpoint="400px" date-format="dd/mm/yy" class="d-flex w-100"/>
            </div>
          </div>
          <div class="row mb-3">
            <div class="form-group col-6">
              <label for="trackingNumber">Номер накладної </label>
              <InputText id="trackingNumber" v-model="order.trackingNumber" type="text" class="d-flex w-100" placeholder="Номер накладної"  />            
            </div>
          </div>
          <RowsTable :rows="order.rows"></RowsTable>
          <div class="d-flex form-group justify-content-start">
            <Button icon="fa fa-cancel" label="Cancel" class="p-button-text" severity="warn" @click="cancel" />
            <Button icon="fa fa-check" label="Ok" class="p-button-text" type="submit" />
          </div>
        </form>
      </template>
    </Card>
    <EditSalePlatform :display="editSalePlatformDisplay" @close="onEditSalePlatformClose"></EditSalePlatform>
  </div>
</template>