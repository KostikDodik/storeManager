const routes = [
    {
        path: '/statistics',
        name: 'settings.statistics',
        component: () => import('./Statistics.vue')
    }
];

export default routes;