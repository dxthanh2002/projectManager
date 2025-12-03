import { defineStore } from "pinia";

type AuthState = {
	/** access token (empty string or null when not set) */
	token: string | null;
};



export const useAuthStore = defineStore("auth", {
	state: (): AuthState => ({
		token: null,
	}),

	getters: {
		isAuthenticated: (state) => !!state.token,
		getToken: (state) => state.token,
	},

	actions: {
		setToken(token: string) {
			this.token = token;
			try {
				localStorage.setItem("token", token);
			} catch (e) {
				// ignore storage errors
			}
		},

		clearToken() {
			this.token = null;
			try {
				localStorage.removeItem("token");
			} catch (e) {
				// ignore storage errors
			}
		},

		/** initialize store from localStorage (call on app start if you want persistence) */
		loadFromStorage() {
			try {
				const t = localStorage.getItem("token");
				if (t) this.token = t;
			} catch (e) {
				/* ignore */
			}
		},
	},
});

