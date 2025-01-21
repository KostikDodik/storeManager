<script setup lang="ts">

import ItemsTable from "./ItemsTable.vue";
</script>

<template>
  <div class="d-flex justify-content-center flex-auto flex-grow-1 flex-shrink-1 overflow-y-scroll">
    <Card class="w-100 h-fit-content m-4" rounded>
      <template #header>
        <h3 class="bg-success-subtle pb-2 ps-3 pt-3">
          Одиниці товару:
        </h3>
      </template>
      <template #content>
        <ItemsTable />
      </template>
    </Card>
  </div>
</template>

<style scoped>

</style>