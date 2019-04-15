import axios from "axios";
import jwt_decode from "jwt-decode";
import {
	USER_SIGN_UP_LOADING,
	USER_SIGN_UP_FAIL,
	USER_SIGN_UP_SUCCESS,
	USER_SIGN_IN_FAIL,
	USER_SIGN_IN_LOADING,
	USER_SIGN_IN_SUCCESS,
	AUTHENTICATE_USER,
	FETCH_CURRENT_USER_LOADING,
	FETCH_CURRENT_USER_SUCCESS,
	FETCH_CURRENT_USER_ERR,
} from "../types/AuthTypes";

export const fetch_current_user = (cb) => {
	return (dispatch) => {
		dispatch({ type: FETCH_CURRENT_USER_LOADING });
		axios
			.get("/api/user/current_user")
			.then((res) => {
				dispatch({ type: FETCH_CURRENT_USER_SUCCESS, payload: res.data });
				if (cb) cb();
			})
			.catch((err) => {
				console.error(err);
				dispatch({ type: FETCH_CURRENT_USER_ERR });
			});
	};
};

export const register_user = (userdata, browser_history = null) => {
	return (dispatch) => {
		dispatch({ type: USER_SIGN_UP_LOADING });
		axios
			.post("/api/user/sign_up", {
				userdata,
			})
			.then((res) => {
				dispatch({ type: USER_SIGN_UP_SUCCESS, payload: res.data });
			})
			.catch((err) => {
				console.error(err);
				dispatch({ type: USER_SIGN_UP_FAIL, payload: err });
			});
	};
};

export const sign_in_user = (userdata) => {
	return (dispatch) => {
		dispatch({ type: USER_SIGN_IN_LOADING });
		axios
			.post("/api/user/sign_in", {
				userdata,
			})
			.then((res) => {
				localStorage.setItem("token", res.data.token);
				const token_decoded = jwt_decode(res.data.token);
				localStorage.setItem("user", JSON.stringify(token_decoded));
				dispatch({ type: AUTHENTICATE_USER, payload: token_decoded });
				dispatch({ type: USER_SIGN_IN_SUCCESS, payload: res.data });
			})
			.catch((err) => {
				console.error(err);
				dispatch({ type: USER_SIGN_IN_FAIL, payload: err });
			});
	};
};

export const reset_auth_reducer_to_init = () => {
	return (dispatch) => {
		dispatch({ type: "AUTH_REDUX_RESET" });
	};
};

export const logout = () => {
	return (dispatch) => {
		localStorage.clear();
	};
};
