<script setup lang="ts">
import {computed, onBeforeMount, ref} from 'vue';
import {ITreeNode} from "@/types/ITreeNode";
import {useStatisticsStore} from "@/stores/statistics";
import {ISalesByCategory} from '@/types/ISalesByProduct';
import {ISupplyStats} from '@/types/ISupplyStats';

const statisticsStore = useStatisticsStore();
const salesByCategory = ref<ITreeNode<ISalesByCategory>[]>();
const supplyStats = ref<ISupplyStats>();
const summarySales = computed(() => salesByCategory.value
    ? [salesByCategory.value[0]?.data]
    : []);

onBeforeMount(() => {
    statisticsStore.getSaleStatistics().then(res => salesByCategory.value = res);
    statisticsStore.getSupplyStatistics().then(res => supplyStats.value = res);
});
</script>

<template>
  <div class="d-flex justify-content-center flex-auto overflow-y-scroll">
    <div class="card w-75 h-fit-content m-4 p-3" rounded>
      <Tabs
          value="0"
      >
        <TabList>
          <Tab value="0"><i class="fa-solid fa-list-check"></i> Збіжна статистика</Tab>
          <Tab value="1"><i class="fa-solid fa-layer-group"></i> Прибутки по категоріям</Tab>
        </TabList>
        <TabPanels>
          <TabPanel key="supplies" value="0">
            <div class="row pb-3">
              <h4>
                Поставки
              </h4>
              <DataTable :value="[supplyStats]">
                <Column field="boughtCount" header="Закуплено од."></Column>
                <Column field="boughtSum" header="Закуплено на суму">
                  <template #body="{ data }">
                    {{ Number(data?.boughtSum).toFixed(2) }}
                  </template>
                </Column>
                <Column field="receivedCount" header="Отримано од."></Column>
                <Column field="receivedSum" header="Отримано товарів на суму">
                  <template #body="{ data }">
                    {{ Number(data?.receivedSum).toFixed(2) }}
                  </template>
                </Column>
              </DataTable>
            </div>
            <div class="row">
              <h4>
                Закупки
              </h4>
              <DataTable :value="summarySales">
                <Column field="income" header="Загальний дохід">
                  <template #body="{ data }">
                    {{ Number(data?.income ?? 0).toFixed(2) }}
                  </template>
                </Column>
                <Column field="netProfit" header="Чистий прибуток">
                  <template #body="{ data }">
                    {{ Number(data?.netProfit ?? 0).toFixed(2) }}
                  </template>
                </Column>
                <Column field="salesCount" header="Продано од."></Column>
              </DataTable>
            </div>
          </TabPanel>
          <TabPanel key="sales" value="1">
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
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>
</template>

<style>
.table-striped .p-treetable-table tbody > tr:nth-of-type(odd) {
    color: var(--bs-table-striped-color);
    background-color: rgba(0, 0, 0, 0.01);
}
</style>