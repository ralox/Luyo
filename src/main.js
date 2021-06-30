import { createApp } from 'vue'
import luyo from './luyo.vue'
import router from './router';
import store from './store/store';

const app = createApp(luyo)
.use(store)
.use(router)
.mount('#app');
