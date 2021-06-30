import Vue from 'vue';
import VueRouter from 'vue-router';
//import store from '@/store/store';
import launch from '../views/launch.vue';


const routes = [
	{
		path: '/',
		redirect: 'Launch',
	},
	{
		path: '/launch',
		name: 'Launch',
		component: launch,
	},
    {
		path: '/mining-run',
		name: 'Mining Run',
		component: () => import(/* webpackChunkName: "gameView" */ '../views/game-view.vue'),
	},
	{
		path: '/command',
		name: 'Command',
		component: () => import(/* webpackChunkName: "command" */ '../views/command.vue'),
	},
	//{
	//	path: '/configuration/history/:id?/:deployEndDateTime?',
	//	name: 'Configuration History',
	//	component: () => import(/* webpackChunkName: "configuration" */ '../views/configuration.vue')
	//},
	{
		path: '*',
		name: 'NotFound',
		component: () => import(/* webpackChunkName: "NotFound" */ '../views/notfound.vue')
	}
];

Vue.use(VueRouter);

const router = new VueRouter({
	routes,
});

export default router;