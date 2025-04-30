<script setup lang="ts">
import { ICheck } from "@/types/IOrder";
import { paymentTypeOptions } from "@/types/PaymentType";
import Textarea from "primevue/textarea";

const rows = defineModel<ICheck[]>("checks", {
    required: true
});

const addRow = () => {
    rows.value.splice(0, 0, <ICheck>{});
}

const deleteClick = (row: ICheck) => {
    rows.value.splice(rows.value.indexOf(row), 1);
}

</script>

<template>
  <div class="d-flex justify-content-end mb-2">
    <Button
      type="button"
      icon="fa-regular fa-plus"
      outlined severity="success"
      @click="() => addRow()"
      label="Додати чек"
    />
  </div>
  <DataTable
    :value="rows"
    paginator
    :rows="10"
    dataKey="id"
    stripedRows
    size="small"
    :key="rows.length"
  >
    <template #empty>Покищо немає оплат</template>
    <Column field="paymentType" header="Тип оплати" headerStyle="width: 10rem">
      <template #body="{ data }: { data: ICheck }">
        <Select
          v-model="data.paymentType"
          :options="paymentTypeOptions"
          placeholder="Тип оплати"
          optionLabel="name"
          optionValue="value"
          class="w-100"
          required
        />
      </template>
    </Column>
    <Column field="sum" header="Сума" headerStyle="width: 7rem">
      <template #body="{ data }: { data: ICheck }">
        <InputNumber
          v-model="data.sum"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          required
        />
      </template>
    </Column>
    <Column
      field="checkLink"
      header="Посилання на чек"
      headerStyle="width: 30rem"
    >
      <template #body="{ data }: { data: ICheck }">
        <InputText
          v-model="data.checkLink"
          placeholder="Посилання"
          class="w-100"
        />
      </template>
    </Column>
    <Column field="notes" header="Примітки">
      <template #body="{ data }: { data: ICheck }">
        <Textarea
          v-model="data.notes"
          placeholder="Примітки"
          autoResize
          :rows="1"
          class="w-100"
        />
      </template>
    </Column>
    <Column headerStyle="width: 4rem" header="Дії">
      <template #body="{ data }: { data: ICheck }">
        <div class="d-flex w-100 justify-content-between">
          <Button
            type="button"
            icon="fa-regular fa-trash-can"
            rounded
            outlined severity="danger"
            @click="() => deleteClick(data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<style>
.p-inputnumber {
    input {
        min-width: 0 !important;
        width: 100% !important;
    }
}
.p-inputtext {
    input {
        min-width: 0 !important;
        width: 100% !important;
    }
}
</style>
