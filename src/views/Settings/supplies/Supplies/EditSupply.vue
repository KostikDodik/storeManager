<script setup lang="ts">
import {computed, onBeforeMount, ref, watch} from "vue";
import {ISupply, stateOptions, SupplyState} from "@/types/ISupply";
import {useSuppliesStore} from "@/stores/supplies";
import {useRoute, useRouter} from "vue-router";
import {useSuppliersStore} from "@/stores/suppliers";
import RowsTable from "./RowsTable.vue";
import EditSupplier from "../Suppliers/EditSupplier.vue";
import {useProductsStore} from "@/stores/products";

const supplyStore = useSuppliesStore();
const supplierStore = useSuppliersStore();
const productStore = useProductsStore();
const props = defineProps<{
    supplyId?: string
}>();
const route = useRoute();
const supplyId = computed(() => <string>route.params.id || props.supplyId);
const originalSupply = ref(<ISupply>{});

const loadSupplies = async () => {
    if (!supplyId.value) {
        return;
    }
    originalSupply.value = await supplyStore.get(supplyId.value);
    await supplyStore.init();
}
watch(() => supplyId.value, loadSupplies);
const editMode = computed(() => !!originalSupply?.value?.id);

const supply = ref(<ISupply>{});
const fillProps = () => {
    supply.value = <ISupply> (originalSupply.value ? { ...originalSupply.value } : {});
    supply.value.rows = (!supply.value.rows ? [] : supply.value.rows.map(row => ({ ...row })));
}

watch(() => supplyId.value, fillProps);
watch(() => originalSupply.value, fillProps);
const suppliers = computed(() => supplierStore.suppliers);
const deliveryFeeAvailable = computed(() => supply.value.state == SupplyState.SentToUkraine || supply.value.state == SupplyState.Received);

const router = useRouter();
const updateAvailableProducts = () => {
    if (supply.value.state === SupplyState.Received 
      || originalSupply.value.state === SupplyState.Received) {        
        productStore.refresh(supply.value.rows?.map(r => r.productId));
    }
}
const ok = (event: any) => {
    event.preventDefault();
    if (editMode.value) {
        supplyStore.update(supply.value).then(() => {
            updateAvailableProducts();
            router.back()
        });        
    } else {
        supplyStore.add(supply.value).then(() => {
            updateAvailableProducts();
            router.back();
        });
    }
};
const cancel = () => {
    router.back();
}

const suppliersLoading = ref(true);
const editSupplierDisplay = ref(false);
const onAddSupplierClick = () => editSupplierDisplay.value = true;
const onEditSupplierClose = (id?: string) => {
    editSupplierDisplay.value = false;
    if (supply.value && id) {
        supply.value.supplierId = id;
    }
}

const totalCount = computed(() => supplyStore.getSupplyCount(supply.value));
const totalSum = computed(() => supplyStore.getSupplySum(supply.value));
const totalIncome = computed(() => supplyStore.getSupplyIncome(supply.value));

const currentSupplier = computed(() => suppliers.value.find(s => s.id === supply.value?.supplierId)?.name);

const onDeliveryFeeChanged = () => {
    supplyStore.calculateDeliveryFees(supply.value);
}

onBeforeMount(() => {
    supplierStore.init().then(() => suppliersLoading.value = false);
    loadSupplies();
    fillProps();
});
</script>

<template>
  <div class="d-flex justify-content-center flex-auto overflow-y-scroll">
    <Card class="w-100 h-fit-content m-4" rounded>
      <template #header>
        <h3 class="bg-success-subtle pb-2 ps-3 pt-3">
          {{editMode ? `Редагувати поставку з ${currentSupplier ?? ""} №${supply.number}` : "Створити поставку"}}
        </h3>
      </template>
      <template #content>
        <form @submit="ok" >
          <div class="row mb-3">
            <div class="form-group col-6">
              <label for="supplier">Постачальник</label>
              <div class="w-100 d-flex justify-content-between">
                <Select
                    v-model="supply.supplierId"
                    editable
                    :options="suppliers"
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Постачальник"
                    class="d-flex w-100 me-2"
                    id="supplier"
                    :loading="suppliersLoading"
                />
                <Button
                    type="button" rounded
                    icon="fa fa-plus"
                    class="flex-shrink-0"
                    v-tooltip="'Створити нового постачальника'"
                    @click="onAddSupplierClick"
                ></Button>
              </div>
            </div>
            <div class="form-group col-6">
              <label for="date">Дата створення поставки</label>
              <DatePicker id="date" v-model="supply.date" breakpoint="400px" date-format="dd/mm/yy" class="d-flex w-100"/>
            </div>
          </div>
          <div class="row mb-3" v-if="editMode">
            <div class="form-group col-6">
              <label for="updatedState">Статус </label>
              <Select 
                  v-model="supply.state" 
                  :options="stateOptions" 
                  optionLabel="name" 
                  optionValue="value" 
                  placeholder="Статус" 
                  class="d-flex w-100"
              />              
            </div>
            <div class="form-group col-6">
              <label for="updatedState">Статус оновлено </label>
              <DatePicker id="updatedState" v-model="supply.updatedState" breakpoint="400px" date-format="dd/mm/yy" class="d-flex w-100"/>
            </div>
          </div>
          <div class="row mb-3">
            <div class="form-group col-6">
              <label for="trackingNumber">Номер накладної </label>
              <InputText id="trackingNumber" v-model="supply.trackingNumber" type="text" class="d-flex w-100" placeholder="Номер накладної"  />            
            </div>
            <div class="form-group col-6">
              <label for="deliveryFee">Ціна за доставку: </label>
              <InputNumber 
                  id="deliveryFee" 
                  v-model="supply.deliveryFee" 
                  :disabled="!deliveryFeeAvailable"
                  :minFractionDigits="2"
                  :maxFractionDigits="2"
                  @blur="onDeliveryFeeChanged"
                  class="d-flex w-100"/>
            </div>
          </div>
          <Accordion class="mb-3">
            <AccordionPanel key="settings" value="0">
              <AccordionHeader class="pb-0">
                <h3>Статистика</h3>
              </AccordionHeader>
              <AccordionContent>
                <DataTable :value="[supply]">
                  <Column field="totalCount" header="К-сть товарів">
                    <template #body="{ data }">
                      {{ totalCount }}
                    </template>
                  </Column>
                  <Column field="soldCount" header="Продано товарів">
                    <template #body="{ data }">
                      {{ data.soldCount ?? 0 }}
                    </template>
                  </Column>
                  <Column field="totalSum" header="Ціна поставки">
                    <template #body="{ data }">
                      {{ Number(totalSum).toFixed(2) }}
                    </template>
                  </Column>
                  <Column field="soldMoney" header="Продано на суму">
                    <template #body="{ data }">
                      {{ Number(data.soldMoney ?? 0).toFixed(2) }}
                    </template>
                  </Column>
                  <Column field="totalIncome" header="Чистий прибуток">
                    <template #body="{ data }">
                      {{ Number(totalIncome).toFixed(2) }}
                    </template>
                  </Column>
                </DataTable>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
          <RowsTable :delivery-disabled="!deliveryFeeAvailable" :rows="supply.rows"></RowsTable>
          <div class="d-flex form-group justify-content-start">
            <Button icon="fa fa-cancel" label="Cancel" class="p-button-text" severity="warn" @click="cancel" />
            <Button icon="fa fa-check" label="Ok" class="p-button-text" type="submit" />
          </div>
        </form>
      </template>
    </Card>
    <EditSupplier :display="editSupplierDisplay" @close="onEditSupplierClose"></EditSupplier>
  </div>
</template>