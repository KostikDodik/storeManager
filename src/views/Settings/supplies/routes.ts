import SupplyList from "./Supplies/SupplyList.vue";
import EditSupply from "./Supplies/EditSupply.vue";
import Items from "@/views/Settings/supplies/Products/Items.vue";

const routes = [
    {
        path: '/products',
        name: 'settings.products',
        component: () => import('./Products/ProductList.vue')
    },
    {
        path: '/categories',
        name: 'settings.categories',
        component: () => import('./Categories/CategoryList.vue')
    },
    {
        path: '/suppliers',
        name: 'settings.suppliers',
        component: () => import('./Suppliers/SupplierList.vue')
    },
    {
        path: '/supplies',
        name: 'supplies',
        component: () => import('./Supplies/Supplies.vue'),
        children: [
            {
                path: '',
                name: 'supplies.list',
                component: SupplyList
            },
            {
                path: 'new',
                name: 'supplies.create',
                component: EditSupply
            },
            {
                path: ':id',
                name: 'supplies.edit',
                component: EditSupply
            }
        ]
    },
    {
        path: '/items',
        name: 'items',
        component: Items
    }
];

export default routes;