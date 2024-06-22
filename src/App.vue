<script setup lang="ts">
import {RouterView, useRouter} from 'vue-router'
import {computed, onMounted, ref} from "vue";
import supplyMenuItems from "./views/Settings/supplies/menuItems";
import orderMenuItems from "./views/Settings/sales/menuItems";

const router = useRouter();

const activeLink = ref("");
function navClick (link: string) {
    activeLink.value = link;
}
const navLinkClasses = (link: string) => ({
    "nav-link": true,
    "active": activeLink.value === link
});

onMounted(() => {
    const arr = window.location.href.split('/').filter(s => !!s);
    activeLink.value = arr[arr.length - 1];
});

const items = ref([...orderMenuItems(router), ...supplyMenuItems(router)]);

</script>

<template>
  <div class="d-flex flex-column w-100 h-100">
    <Menubar :model="items">
      <template #start>
        <h3>Краса Korean <i class="fa-solid fa-wand-magic-sparkles"></i> </h3>
      </template>
      <template #item="{ item, props, hasSubmenu, root }">
        <a v-ripple class="flex items-center" v-bind="props.action">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
          <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
          <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
          <i v-if="hasSubmenu" :class="['pi pi-angle-down', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"></i>
        </a>
      </template>
      <template #end>
        <div class="flex items-center gap-2">
          <InputText placeholder="Search" type="text" class="w-32 sm:w-auto" />
          <Avatar image="/images/avatar/amyelsner.png" shape="circle" />
        </div>
      </template>
    </Menubar>
    <div class="d-flex flex-grow-1 flex-shrink-1">
      <RouterView/>
    </div>
  </div>
</template>