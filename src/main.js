import Vue from 'vue';
import App from './App';
import router from './router';

import ElementUI from 'element-ui';
import '../static/css/theme/index.css';
Vue.use(ElementUI);

import axios from '../core/axios_http';
Vue.prototype.$axios = axios;


import store from './store/index';

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');