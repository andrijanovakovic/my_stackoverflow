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
	AUTH_REDUX_RESET,
} from "../types/AuthTypes";

let initialState = {
	user_sign_up_loading: false,
	user_sign_up_data: [],
	user_sign_up_error: [],

	user_sign_in_loading: false,
	user_sign_in_data: [],
	user_sign_in_error: [],

	user_authenticated: false,
	user_data: [],
	user_data_loading: false,
	user_check_required: true,
};

export default function(state = initialState, action) {
	switch (action.type) {
		case USER_SIGN_UP_LOADING:
			return { ...state, user_sign_up_loading: true, user_sign_up_data: [], user_sign_up_error: [] };
		case USER_SIGN_UP_SUCCESS:
			return { ...state, user_sign_up_loading: false, user_sign_up_data: action.payload, user_sign_up_error: [] };
		case USER_SIGN_UP_FAIL:
			return { ...state, user_sign_up_loading: false, user_sign_up_data: [], user_sign_up_error: action.payload };

		case USER_SIGN_IN_LOADING:
			return { ...state, user_sign_in_loading: true, user_sign_in_data: [], user_sign_in_error: [] };
		case USER_SIGN_IN_SUCCESS:
			return { ...state, user_sign_in_loading: false, user_sign_in_data: action.payload, user_sign_in_error: [] };
		case USER_SIGN_IN_FAIL:
			return { ...state, user_sign_in_loading: false, user_sign_in_data: [], user_sign_in_error: action.payload };
		case AUTHENTICATE_USER:
			return { ...state, user_authenticated: true };
		case AUTH_REDUX_RESET:
			return initialState;

		case FETCH_CURRENT_USER_LOADING:
			return { ...state, user_data_loading: true };
		case FETCH_CURRENT_USER_SUCCESS:
			return { ...state, user_data_loading: false, user_data: action.payload, user_check_required: false };
		case FETCH_CURRENT_USER_ERR:
			localStorage.clear();
			return { ...state, user_data_loading: false, user_data: [] };

		default:
			return state;
	}
}
