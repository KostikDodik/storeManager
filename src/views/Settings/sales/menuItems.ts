import {MenuItem} from "primevue/menuitem";
import {Router} from "vue-router";

export default function menuItems(router: Router) : MenuItem[] {
    return [
        {
            label: "Продажі",
            icon: "fa-solid fa-money-bill-wave",
            items: [
                {
                    label: "Замовлення",
                    icon: "fa-solid fa-money-check-dollar",
                    command: () => {
                        router.push({
                            name: "orders.list"
                        });
                    }
                },
                {
                    label: "Торгові платформи",
                    icon: "fa-solid fa-people-roof",
                    command: () => {
                        router.push({
                            name: "settings.salePlatforms"
                        });
                    }
                }
            ]
        }
    ]
} 