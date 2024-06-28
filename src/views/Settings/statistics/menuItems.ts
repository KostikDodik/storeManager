import {MenuItem} from "primevue/menuitem";
import {Router} from "vue-router";

export default function menuItems(router: Router) : MenuItem[] {
    return [
        {
            label: 'Поставки',
            icon: 'fa-solid fa-arrow-trend-up',
            command: () => {
                router.push({
                    name: "settings.statistics"
                });
            }
        }
    ]
} 