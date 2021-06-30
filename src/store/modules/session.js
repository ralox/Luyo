/*
	Define all data for a game session.

	Notifications provide feedback on system events and user actions.
	As a general rule, they are short-lived, client-side instances.
*/
const namespaced = true;

const state = {
	gameState: 'play',
    captainName: '',
};

/*
	Actions hook up to the interface, but they do not touch the store data directly.
	They can be rather complicated and will generally lean on one or more mutations.
	Actions are also the communication layer with external sources (API).

	Actions come with access to four contexts ({ state, getters, commit, dispatch })
		state = direct data access... avoid use
		getters = indirect data access... this is good
		commit = call a mutation
		dispatch = maybe one day I'll create an API and do some server-side processing for fun
*/
const actions = {

	newSession({ commit }) {
		commit('NEW_SESSION');
	},
};

/*
	Mutations are methods that act on the state data directly.
	They should be incredibly basic and perform a single task.

	Mutations always take in the current 'state' and a payload.
*/
const mutations = {
	NEW_SESSION(state) {
		state.gameState = 'play';
	},
};

