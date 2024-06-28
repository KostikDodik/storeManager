<script setup lang="ts">
import {computed, onBeforeMount, ref} from 'vue';
import {useCategoriesStore} from "@/stores/categories";
import {ITreeNode, makeTreeNodes} from "@/types/ITreeNode";
import {useStatisticsStore} from "@/stores/statistics";
import {ISalesByCategory} from '@/types/ISalesByProduct';

const statisticsStore = useStatisticsStore();
const salesByCategory = ref<ITreeNode<ISalesByCategory>[]>()

const editCategory = ref(false);

onBeforeMount(() => statisticsStore.getSaleStatistics().then(res => salesByCategory.value = res));
</script>

<template>
  <div class="d-flex justify-content-center flex-auto overflow-y-scroll">
    <Card class="w-100 h-fit-content m-4" rounded>
      <template #header>
        <h3 class="bg-success-subtle pb-2 ps-3 pt-3">
          Прибутки по категоріях:
        </h3>
      </template>
      <template #content>
        <div class="table-striped">
          <TreeTable :value="salesByCategory" resizable-columns show-gridlines>
            <Column field="name" header="Назва" expander></Column>
            <Column field="income" header="Загальний дохід" headerStyle="width: 10rem">
              <template #body="{ node }">
                {{ Number(node?.data?.income ?? 0).toFixed(2) }}
              </template>
            </Column>
            <Column field="netProfit" header="Чистий прибуток" headerStyle="width: 10rem">
              <template #body="{ node }">
                {{ Number(node?.data?.netProfit ?? 0).toFixed(2) }}
              </template>
            </Column>
            <Column field="netProfitPercent" header="Чистий прибуток, %" headerStyle="width: 10rem">
              <template #body="{ node }">
                {{ Number(node?.data?.netProfitPercent ?? 0).toFixed(1) }}%
              </template>
            </Column>
            <Column field="salesCount" header="Продано од." headerStyle="width: 10rem"></Column>
            <Column field="salesPercent" header="Продано од, %" headerStyle="width: 10rem">
              <template #body="{ node }">
                {{ Number(node?.data?.salesPercent ?? 0).toFixed(1) }}%
              </template>
            </Column>
          </TreeTable>
        </div>
      </template>
    </Card>
  </div>
</template>

<style>
.table-striped .p-treetable-table tbody > tr:nth-of-type(odd) {
    color: var(--bs-table-striped-color);
    background-color: rgba(0, 0, 0, 0.01);
}
</style>