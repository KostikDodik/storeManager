import {createRouter, createWebHistory} from 'vue-router'
import supplies from "@/views/Settings/supplies/routes";
import sales from "@/views/Settings/sales/routes";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        ...supplies,
        ...sales
    ]
});

export default router;
