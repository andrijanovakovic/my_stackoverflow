import {
	GET_QUESTIONS_LOADING,
	GET_QUESTIONS_SUCCESS,
	GET_QUESTIONS_ERROR,
	GET_ALL_AVAILABLE_TAGS_LOADING,
	GET_ALL_AVAILABLE_TAGS_SUCCESS,
	GET_ALL_AVAILABLE_TAGS_FAIL,
	CORE_REDUX_RESET,
	CREATE_QUESTION_LOADING,
	CREATE_QUESTION_SUCCESS,
	CREATE_QUESTION_FAIL,
	GET_QUESTION_DETAILS_LOADING,
	GET_QUESTION_DETAILS_FAIL,
	GET_QUESTION_DETAILS_SUCCESS,
	ACCEPT_ANSWER_FAIL,
	ACCEPT_ANSWER_LOADING,
	ACCEPT_ANSWER_SUCCESS,
} from "../types/CoreTypes";

let initialState = {
	questions_loading: false,
	questions_data: [],
	questions_error: [],
	all_available_tags_data: [],
	all_available_tags_loading: false,
	all_available_tags_error: [],
	create_question_data: [],
	create_question_loading: false,
	create_question_fail: [],
	question_details_data: [],
	question_details_loading: false,
	question_details_fail: [],
	accept_answer_loading: false,
	accept_answer_data: [],
	accept_answer_error: [],
};

export default function(state = initialState, action) {
	switch (action.type) {
		case GET_QUESTIONS_LOADING:
			return { ...state, questions_data: [], questions_error: [], questions_loading: true };
		case GET_QUESTIONS_SUCCESS:
			return { ...state, questions_data: action.payload, questions_error: [], questions_loading: false };
		case GET_QUESTIONS_ERROR:
			return { ...state, questions_data: [], questions_error: action.payload, questions_loading: false };

		case CORE_REDUX_RESET:
			return initialState;

		case GET_ALL_AVAILABLE_TAGS_LOADING:
			return { ...state, all_available_tags_data: [], all_available_tags_error: [], all_available_tags_loading: true };
		case GET_ALL_AVAILABLE_TAGS_SUCCESS:
			return { ...state, all_available_tags_data: action.payload, all_available_tags_error: [], all_available_tags_loading: false };
		case GET_ALL_AVAILABLE_TAGS_FAIL:
			return { ...state, all_available_tags_data: [], all_available_tags_error: action.payload, all_available_tags_loading: false };

		case CREATE_QUESTION_LOADING:
			return { ...state, create_question_data: [], create_question_fail: [], create_question_loading: true };
		case CREATE_QUESTION_SUCCESS:
			return { ...state, create_question_data: action.payload, create_question_fail: [], create_question_loading: false };
		case CREATE_QUESTION_FAIL:
			return { ...state, create_question_data: [], create_question_fail: action.payload, create_question_loading: false };

		case GET_QUESTION_DETAILS_LOADING:
			return { ...state, question_details_data: [], question_details_fail: [], question_details_loading: true };
		case GET_QUESTION_DETAILS_SUCCESS:
			return { ...state, question_details_data: action.payload, question_details_fail: [], question_details_loading: false };
		case GET_QUESTION_DETAILS_FAIL:
			return { ...state, question_details_data: [], question_details_fail: action.payload, question_details_loading: false };

		case ACCEPT_ANSWER_LOADING:
			return { ...state, accept_answer_data: [], accept_answer_error: [], accept_answer_loading: true };
		case ACCEPT_ANSWER_SUCCESS:
			return { ...state, accept_answer_data: action.payload, accept_answer_error: [], accept_answer_loading: false };
		case ACCEPT_ANSWER_FAIL:
			return { ...state, accept_answer_data: [], accept_answer_error: action.payload, accept_answer_loading: false };

		default:
			return state;
	}
}
