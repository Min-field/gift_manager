import router from '@/router/index';
import store from '@/store/index';
import axios from 'axios';
import qs from 'qs';

axios.defaults.baseURL = 'https://wechat.colonp.top';
axios.defaults.timeout = 5000;

/*request 拦截器*/
axios.interceptors.request.use(
	config => {
		let token_loc = localStorage.getItem('token');
		let token_store = store.state.token;
		if(token_store){
			config.headers.Authorization = `Bearer ${token_store}`;
		}else if(token_loc){
			config.headers.Authorization = `Bearer ${token_loc}`;
		}
		return config;
	},
	err => Promise.reject(err)
);

/*response 拦截器*/
axios.interceptors.response.use(
	res => res,
	err => {
		if(err.response){
			switch (err.response.status) {
				case 401:
				case 403: {
					store.commit('logout');
					router.replace({
						path: 'login',
						query: {targetPath: router.currentRoute.fullPath}
					});
				};
			}
		}
		alert('请求错误');
		return Promise.reject(err);
	}
);

export default {
	post(url, data) {
		return axios({
			method: 'post',
			url,
			data: qs.stringify(data),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
		}).then((res)=>{
			var data = res.data;
			if(data.return_code == "SUCCESS"){
				return data;
			}else{
				throw data;
			}
		});
	},
	post2(url, data) {
		return axios({
			method: 'post',
			url,
			data:data,   // 传输的是文件流，不需要qs.stringify
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			headers:{
				'Content-Type':'multipart/form-data'
			}, 			
		}).then((res)=>{
			var data = res.data;
			if(data.return_code == "SUCCESS"){
				return data;
			}else{
				throw data;
			}
		});
	},
	get(url, params) {
		return axios({
			method: 'get',
			url,
			params,
		}).then((res)=>{
			var data = res.data;
			if(data.return_code == "SUCCESS"){
				return data;
			}else{
				throw data;
			}
		});
	}
};
