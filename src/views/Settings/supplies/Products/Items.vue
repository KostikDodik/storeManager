<script setup lang="ts">

</script>

<template>
  <div class="d-flex justify-content-center flex-auto overflow-y-scroll">
    <Card class="w-100 h-fit-content m-4" rounded>
      <template #header>
        <h3 class="bg-success-subtle pb-2 ps-3 pt-3">
          <div class="row">
            <div class="col-6">
              Продукт: {{product.name}}
            </div>
            <div class="col-6">
              Категорія: {{product.name}}
            </div>
          </div>
        </h3>
      </template>
      <template #content>
        <div class="d-flex justify-content-end mb-2">
          <Button type="button" icon="fa-regular fa-plus" severity="success" @click="() => addProduct()" label="Додати найменування"/>
        </div>
        <DataTable
          :value="displayProducts"
          v-model:filters="filters"
          paginator
          :rows="10"
          dataKey="id"
          filterDisplay="row"
          sortMode="multiple"
          :loading="loading"
          removableSort
          stripedRows
          size="small"
          :first="10 * viewModel.supplyListCurrentPage"
          @page="pageChanged"
        ></DataTable>
</template>