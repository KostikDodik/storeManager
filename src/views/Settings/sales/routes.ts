import OrderList from "./Orders/OrderList.vue";
import Edit from "./Orders/Edit.vue";

const routes = [
    {
        path: '/sale-platforms',
        name: 'settings.salePlatforms',
        component: () => import('./SalePlatforms/SalePlatformList.vue')
    },
    {
        path: '/orders',
        name: 'orders',
        component: () => import('./Orders/Orders.vue'),
        children: [
            {
                path: '',
                name: 'orders.list',
                component: OrderList
            },
            {
                path: 'new',
                name: 'orders.create',
                component: Edit
            },
            {
                path: ':id',
                name: 'orders.edit',
                component: Edit
            }
        ]
    }
];

export default routes;