import "bootstrap/dist/js/bootstrap.bundle.min.js"
import './assets/main.css';
import '@/utilities/date';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import Button from "primevue/button";
import TreeTable from "primevue/treetable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import Select from "primevue/select";
import TreeSelect from 'primevue/treeselect';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import DatePicker from 'primevue/datepicker';
import Tooltip from 'primevue/tooltip';
import Menubar from 'primevue/menubar';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import ConfirmationService from 'primevue/confirmationservice';

import Lara from 'primevue/themes/lara';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Lara,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    },
    locale: {
        firstDayOfWeek: 1,
        dayNames: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"],
        dayNamesShort: ["Нед", "Пон", "Вів", "Сер", "Чет", "П'ят", "Суб"],
        dayNamesMin: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        monthNames: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
        monthNamesShort: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
        today: "Сьогодні",
        clear: "Очистити",
        dateFormat: "mm/dd/yy",
        weekHeader: "ТД"
    }
});
app.use(ConfirmationService);
app.component("Button", Button);
app.component("TreeTable", TreeTable);
app.component("Column", Column);
app.component("Dialog", Dialog);
app.component("Select", Select);
app.component("TreeSelect", TreeSelect);
app.component("InputText", InputText);
app.component("InputNumber", InputNumber);
app.component("Card", Card);
app.component("DataTable", DataTable);
app.component("DatePicker", DatePicker);
app.component("Menubar", Menubar);
app.directive('tooltip', Tooltip);
app.component("Accordion", Accordion);
app.component("AccordionPanel", AccordionPanel);
app.component("AccordionHeader", AccordionHeader);
app.component("AccordionContent", AccordionContent);
app.component("Tabs", Tabs);
app.component("TabList", TabList);
app.component("Tab", Tab);
app.component("TabPanels", TabPanels);
app.component("TabPanel", TabPanel);

app.mount('#app')
