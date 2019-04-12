import axios from "axios";
import { USER_SIGN_UP_LOADING, USER_SIGN_UP_FAIL, USER_SIGN_UP_SUCCESS } from "../types/AuthTypes";

export const register_user = (userdata) => {
	return (dispatch) => {
		dispatch({ type: USER_SIGN_UP_LOADING });
		axios
			.post("/api/user/sign_up", {
				userdata,
			})
			.then((res) => {
				console.log(res);
				dispatch({ type: USER_SIGN_UP_SUCCESS });
			})
			.catch((err) => {
				console.log(err);
				dispatch({ type: USER_SIGN_UP_FAIL });
			});
	};
};
