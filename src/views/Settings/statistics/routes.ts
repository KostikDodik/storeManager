const routes = [
    {
        path: '/statistics',
        name: 'settings.statistics',
        component: () => import('./statistics.vue')
    }
];

export default routes;