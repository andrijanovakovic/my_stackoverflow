import { GET_QUESTIONS_LOADING, GET_QUESTIONS_SUCCESS, GET_QUESTIONS_ERROR } from "../types/CoreTypes";

let initialState = {
	questions_loading: false,
	questions_data: [],
	questions_error: [],
};

export default function(state = initialState, action) {
	switch (action.type) {
		case GET_QUESTIONS_LOADING:
			return { ...state, questions_data: [], questions_error: [], questions_loading: true };
		case GET_QUESTIONS_SUCCESS:
			return { ...state, questions_data: action.payload, questions_error: [], questions_loading: false };
		case GET_QUESTIONS_ERROR:
			return { ...state, questions_data: [], questions_error: action.payload, questions_loading: false };
		default:
			return state;
	}
}
