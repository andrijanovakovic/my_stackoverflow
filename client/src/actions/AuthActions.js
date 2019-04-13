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
} from "../types/AuthTypes";

export const register_user = (userdata, browser_history = null) => {
	return (dispatch) => {
		dispatch({ type: USER_SIGN_UP_LOADING });
		axios
			.post("/api/user/sign_up", {
				userdata,
			})
			.then((res) => {
				dispatch({ type: USER_SIGN_UP_SUCCESS, payload: res.data });
				if (res.data.success === true && browser_history !== null) {
					browser_history.push("/sign_in?sign_up_successfull=true");
				}
			})
			.catch((err) => {
				console.error(err);
				dispatch({ type: USER_SIGN_UP_FAIL, payload: err });
			});
	};
};

export const sign_in_user = (userdata, browser_history = null, redirect_to = "/") => {
	return (dispatch) => {
		dispatch({ type: USER_SIGN_IN_LOADING });
		axios
			.post("/api/user/sign_in", {
				userdata,
			})
			.then((res) => {
				if (res.data.token) {
					localStorage.setItem("token", res.data.token);
					const token_decoded = jwt_decode(res.data.token);
					localStorage.setItem("user", JSON.stringify(token_decoded));
					dispatch({ type: AUTHENTICATE_USER, payload: token_decoded });
				}
				dispatch({ type: USER_SIGN_IN_SUCCESS, payload: res.data });
				if (res.data.success === true && browser_history !== null) {
					// browser_history.push(redirect_to.pathname && !redirect_to.pathname.includes("sign_out") ? redirect_to.pathname : "/");
				}
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
