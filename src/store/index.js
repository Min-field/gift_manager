import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		username: '',
		token: null
	},
	mutations: {
		logout: (state) => {
			localStorage.removeItem('token');
			localStorage.removeItem('username');
			state.token = null;
			state.username = '';
		}
	}
});

export default store;