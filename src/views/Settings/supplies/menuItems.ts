import {MenuItem} from "primevue/menuitem";
import {Router} from "vue-router";

export default function menuItems(router: Router) : MenuItem[] {
    return [
        {
            label: 'Поставки',
            icon: 'fa-solid fa-boxes-packing',
            items: [
                {
                    label: 'Поставки',
                    icon: 'fa-solid fa-dolly',
                    command: () => {
                        router.push({
                            name: "supplies.list"
                        });
                    }
                },
                {
                    label: 'Постачальники',
                    icon: 'fa-solid fa-store',
                    command: () => {
                        router.push({
                            name: "settings.suppliers"
                        });
                    }
                }
            ]
        },
        {
            label: "Товари",
            icon: "fa-solid fa-box-open",
            items: [
                {
                    label: "Найменування товарів",
                    icon: "fa-solid fa-box",
                    command: () => {
                        router.push({
                            name: "settings.products"
                        });
                    }
                },
                {
                    label: "Категорії товарів",
                    icon: "fa-solid fa-boxes-stacked",
                    command: () => {
                        router.push({
                            name: "settings.categories"
                        });
                    }
                }
            ]
        }
    ]
} 