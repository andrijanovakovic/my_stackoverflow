import axios from "axios";
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
	ADD_ANSWER_TO_QUESTION_LOADING,
	ADD_ANSWER_TO_QUESTION_ERROR,
	ADD_ANSWER_TO_QUESTION_SUCCESS,
	ACCEPT_ANSWER_FAIL,
	ACCEPT_ANSWER_LOADING,
	ACCEPT_ANSWER_SUCCESS,
} from "../types/CoreTypes";

export const all_available_questions = () => {
	return (dispatch) => {
		dispatch({ type: GET_QUESTIONS_LOADING });
		axios
			.get("/api/q/all_available_questions")
			.then((res) => {
				dispatch({ type: GET_QUESTIONS_SUCCESS, payload: res.data });
			})
			.catch((err) => {
				console.error(err);
				dispatch({ type: GET_QUESTIONS_ERROR });
			});
	};
};

export const create_question = (question) => {
	return (dispatch) => {
		dispatch({ type: CREATE_QUESTION_LOADING });
		axios
			.post("/api/q/create_question", {
				question,
			})
			.then((res) => {
				dispatch({ type: CREATE_QUESTION_SUCCESS, payload: res.data });
			})
			.catch((err) => {
				console.error(err);
				dispatch({ type: CREATE_QUESTION_FAIL });
			});
	};
};

export const get_all_available_tags = () => {
	return (dispatch) => {
		dispatch({ type: GET_ALL_AVAILABLE_TAGS_LOADING });
		axios
			.get("/api/q/all_available_tags")
			.then((res) => {
				dispatch({ type: GET_ALL_AVAILABLE_TAGS_SUCCESS, payload: res.data });
			})
			.catch((err) => {
				console.error(err);
				dispatch({ type: GET_ALL_AVAILABLE_TAGS_FAIL });
			});
	};
};

export const reset_core_reducer_to_init = () => {
	return (dispatch) => {
		dispatch({ type: CORE_REDUX_RESET });
	};
};

export const get_question_details = (id) => {
	return (dispatch) => {
		dispatch({ type: GET_QUESTION_DETAILS_LOADING });
		axios
			.get("/api/q/get_question_details/" + id)
			.then((res) => {
				dispatch({ type: GET_QUESTION_DETAILS_SUCCESS, payload: res.data });
			})
			.catch((err) => {
				console.error(err);
				dispatch({ type: GET_QUESTION_DETAILS_FAIL });
			});
	};
};

export const add_answer_to_question = (question_id, answer, cb) => {
	return (dispatch) => {
		dispatch({ type: ADD_ANSWER_TO_QUESTION_LOADING });
		axios
			.post("/api/a/add_answer_to_question/", {
				question_id,
				answer,
			})
			.then((res) => {
				dispatch({ type: ADD_ANSWER_TO_QUESTION_SUCCESS, payload: res.data });
				if (cb) cb();
			})
			.catch((err) => {
				dispatch({ type: ADD_ANSWER_TO_QUESTION_ERROR });
			});
	};
};

export const accept_this_answer = (answer, cb) => {
	return (dispatch) => {
		dispatch({ type: ACCEPT_ANSWER_LOADING });
		axios
			.post("/api/a/accept_answer/", {
				answer,
			})
			.then((res) => {
				dispatch({ type: ACCEPT_ANSWER_SUCCESS, payload: res.data });
				if (cb) cb();
			})
			.catch((err) => {
				dispatch({ type: ACCEPT_ANSWER_FAIL });
			});
	};
};

export const add_comment_to_answer = (answer_id, comment_value, question_id, cb) => {
	return (dispatch) => {
		axios
			.post("/api/c/add_comment_to_answer", {
				answer_id,
                comment_value,
                question_id,
			})
			.then((res) => {
				console.log(res.data);
				if (cb) cb();
			})
			.catch((err) => {
				console.error(err);
			});
	};
};
