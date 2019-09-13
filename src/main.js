import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import { router } from './Router/index'
import VueApexCharts from "vue-apexcharts";
import botNav from './components/botNav';

Vue.config.productionTip = false;
Vue.component("apexchart", VueApexCharts);
Vue.component("botNav", botNav);


new Vue({
  render: h => h(App),
  router
}).$mount('#app');
