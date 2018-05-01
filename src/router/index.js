import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router =  new Router({
	routes: [
		{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/login',
			component: resolve => require(['../components/page/Login.vue'], resolve)
		},
		{
			path: '/index',
			component: resolve => require(['../components/common/Home.vue'], resolve),
			children:[
				{
					path: '/',
					component: resolve => require(['../components/page/Index.vue'], resolve),
					meta: { requireAuth: true }
				},
				{
					path: '/gift',
					component: resolve => require(['../components/page/Gift.vue'], resolve),
					meta: { requireAuth: true }
				},
				{
					path: '/user',
					component: resolve => require(['../components/page/User.vue'], resolve),
					meta: { requireAuth: true }
				},
				{
					path: '/template',
					component: resolve => require(['../components/page/Template.vue'], resolve),
					meta: { requireAuth: true }
				},
				{
					path: '/order',
					component: resolve => require(['../components/page/Order.vue'], resolve),
					meta: { requireAuth: true }
				},
				{
					path: '/condition',
					component: resolve => require(['../components/page/Condition.vue'], resolve),
					meta: { requireAuth: true }
				}
			]
		}
	]
});
/*验证 token*/
router.beforeEach((to, from, next) => {
	let token = localStorage.getItem('token');
	// 默认
	// if(to.meta.requireAuth){
	// 	if(token){
	// 		next()
	// 	}else{
	// 		next({
	// 			path: '/login',
	// 			query: { targetPath: to.fullPath }
	// 		});
	// 	}
	//
	// }else{
	// 	next();
	// }

	next();
});

export default router;
