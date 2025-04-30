<script setup lang="ts">
import { getSalePlatformsQuery } from "@/services/SalePlatformService";
import { computed, ref, toRaw, toRef, watch } from "vue";
import {
    addCommissionCategory,
    getForCategoryQuery,
    updateCommissionCategory,
    deleteCommissionCategory
} from "@/services/CommissionsService";
import Panel from "primevue/panel";
import { ICommission, ICommissionCategory } from "@/types/ICommission";

const props = defineProps<{ categoryId: string }>();
const salePlatforms = getSalePlatformsQuery().data;
const commissionCategories = getForCategoryQuery(toRef(() => props.categoryId)).data

const selectedPlatform = ref<string>();
const selectedPlatformName = computed(() => salePlatforms.value?.find(s => s.id === selectedPlatform.value)?.name);
const commissionCategory = computed(() => commissionCategories.value
    ?.find(c => c.salePlatformId === selectedPlatform.value));

const serverCommissions = computed(() => commissionCategory.value?.commissionSizes);
const makeEditableCommissions = (): ICommission[] =>
    serverCommissions.value?.map(c => structuredClone(toRaw(c))) ?? [];
const commissions = ref<ICommission[]>(makeEditableCommissions());
watch([serverCommissions, commissionCategory], () => commissions.value = makeEditableCommissions());

const noData = computed(() => !commissions.value?.length);
const noInheritedData = computed(() => !commissionCategory.value?.inheritedSizes?.length);

const addCommission = (): void => {
    commissions.value.push(<ICommission>{ priceOver: 0 });
}

watch(() => commissions.value?.length === 1, (value: boolean) => {
    if (value) {
        // If any commission exists, there should be a default commission from over 0 
        commissions.value[0].priceOver = 0;
    }
})

const deleteCommission = (index: number) => {
    commissions.value.splice(index, 1);
}

const saveCategory = async() => {
    const category: ICommissionCategory = {
        ...commissionCategory.value!,
        commissionSizes: commissions.value
    }
    if (category.id) {
        await updateCommissionCategory(category);
    } else {
        await addCommissionCategory(category);
    }
    selectedPlatform.value = undefined;
}

const deleteCategory = async() => {
    await deleteCommissionCategory(commissionCategory.value!);
    commissions.value = [];
}

</script>

<template>
  <Select
    v-model="selectedPlatform"
    filter
    reset-filter-on-hide
    reset-filter-on-clear
    :options="salePlatforms"
    optionLabel="name" optionValue="id"
    placeholder="Торгова платформа"
    class="d-flex w-100 mb-2"
  />
  <template v-if="selectedPlatform">
    <Panel
      v-if="noData && noInheritedData"
      collapsed
      class="w-100 h-fit-content"
    >
      <template #header>
        <div class="d-flex w-100 align-items-baseline justify-content-between">
          <h6 class="d-inline-block flex-fill">Комісії не встановлені. Немає успадкованих налаштувань </h6>
          <Button
            outlined
            severity="success"
            icon="fa-solid fa-plus"
            class="flex-grow-0 flex-shrink-0"
            :label="'Вказати комісію для ' + selectedPlatformName"
            @click="addCommission"
          />
        </div>
      </template>
    </Panel>
    <Panel
      v-else-if="noData"
      class="w-100 h-fit-content"
    >
      <template #header>
        <div class="d-flex w-100 align-items-baseline justify-content-between">
          <h6 class="d-inline-block flex-fill">Комісії не встановлені. Працюють успадковані налаштування</h6>
          <Button
            outlined
            variant="success"
            icon="fa-solid fa-plus"
            class="flex-grow-0 flex-shrink-0"
            :title="'Вказати комісію для ' + selectedPlatformName"
            @click="addCommission"
          />
        </div>
      </template>
      <DataTable
        :value="commissionCategory?.inheritedSizes"
        dataKey="id"
        stripedRows
        size="small"
      >
        <Column field="priceOver" header="Працює при ціні від (грн)" headerStyle="width: 10rem">
          <template #body="{ data }: { data: ICommission }">
            <span class="ps-2"> {{ (data.priceOver ?? 0).toFixed(2) }} ₴</span>
          </template>
        </Column>
        <Column field="commission" header="Комісія (%)" headerStyle="width: 10rem">
          <template #body="{ data }: { data: ICommission }">
            <span class="ps-2"> {{ data.commission ?? 0 }}% </span>

          </template>
        </Column>
      </DataTable>
    </Panel>
    <Panel
      v-else
      class="w-100 h-fit-content"
    >
      <template #header>
        <div class="d-flex w-100 align-items-baseline justify-content-between">
          <h6 class="d-inline-block flex-fill">Налаштування комісій</h6>
          <Button
            outlined
            variant="success"
            icon="fa-solid fa-plus"
            class="flex-grow-0 flex-shrink-0"
            :title="'Додати комісію для ' + selectedPlatformName"
            @click="addCommission"
          />
          <Button
            outlined
            severity="danger"
            icon="fa-solid fa-cancel"
            class="flex-grow-0 flex-shrink-0 ms-1 me-1"
            :title="'Скинути налаштування для ' + selectedPlatformName"
            @click="deleteCategory"
          />
        </div>
      </template>
      <DataTable
        :value="commissions"
        paginator
        :rows="10"
        dataKey="id"
        stripedRows
        size="small"
        :key="commissions?.length"
      >
        <template #empty>Комісії не встановлені</template>
        <Column field="priceOver" header="Працює при ціні від (грн)" headerStyle="width: 10rem">
          <template #body="{ data, index }: { data: ICommission, index: number }">
            <InputNumber
              v-if="index > 0"
              v-model="data.priceOver"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              suffix=" ₴"
              required
            />
            <span v-else class="ps-2">
                {{ (data.priceOver ?? 0).toFixed(2) }} ₴
              </span>
          </template>
        </Column>
        <Column field="commission" header="Комісія (%)" headerStyle="width: 10rem">
          <template #body="{ data }: { data: ICommission }">
            <InputNumber
              v-model="data.commission"
              :minFractionDigits="0"
              :maxFractionDigits="0"
              suffix="%"
              required
            />
          </template>
        </Column>
        <Column headerStyle="width: 4rem" header="Дії">
          <template #body="{ index }: { index: number }">
            <div class="d-flex w-100 justify-content-between">
              <Button
                type="button"
                icon="fa-regular fa-trash-can"
                rounded
                outlined
                severity="danger"
                @click="() => deleteCommission(index)"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <template #footer>
        <div class="d-flex w-100 align-items-baseline justify-content-end">
          <Button
            outlined
            variant="success"
            icon="fa-solid fa-check"
            class="flex-grow-0 flex-shrink-0"
            :label="'Зберегти комісії для ' + selectedPlatformName"
            @click="saveCategory"
          />
          <Button
            outlined
            severity="danger"
            icon="fa-solid fa-cancel"
            class="flex-grow-0 flex-shrink-0 ms-1 me-1"
            :label="'Скинути налаштування для ' + selectedPlatformName"
            @click="deleteCategory"
          />
        </div>
      </template>
    </Panel>
  </template>
</template>