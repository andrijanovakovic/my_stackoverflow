import { USER_SIGN_UP_LOADING, USER_SIGN_UP_FAIL, USER_SIGN_UP_SUCCESS } from "../types/AuthTypes";

let initialState = {
	user_sign_up_loading: false,
	user_sign_up_data: [],
	user_sign_up_error: [],
};

export default function(state = initialState, action) {
	switch (action.type) {
		case USER_SIGN_UP_LOADING:
			return { ...state, user_sign_up_loading: true, user_sign_up_data: [], user_sign_up_error: [] };
		case USER_SIGN_UP_SUCCESS:
			return { ...state, user_sign_up_loading: false, user_sign_up_data: action.payload, user_sign_up_error: [] };
		case USER_SIGN_UP_FAIL:
			return { ...state, user_sign_up_loading: false, user_sign_up_data: [], user_sign_up_error: action.payload };
		default:
			return state;
	}
}
