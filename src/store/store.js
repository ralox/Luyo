import { createApp } from 'vue';
import { createStore } from 'vuex';

import * as session from './modules/session.js';

const store = createStore({
	modules: {
		session,
	}
})

/*export default new Vuex.Store({
	
});
*/
