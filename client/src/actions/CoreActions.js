import axios from "axios";
import { GET_QUESTIONS_LOADING, GET_QUESTIONS_SUCCESS, GET_QUESTIONS_ERROR } from "../types/CoreTypes";

export const get_questions = () => {
	return (dispatch) => {
		dispatch({ type: GET_QUESTIONS_LOADING });
		axios
			.get("/api/q/get_questions")
			.then((res) => {
				dispatch({ type: GET_QUESTIONS_SUCCESS });
			})
			.catch((err) => {
				console.error(err);
				dispatch({ type: GET_QUESTIONS_ERROR });
			});
	};
};

export const create_question = (question) => {
	return (dispatch) => {
		dispatch({ type: GET_QUESTIONS_LOADING });
		axios
			.post("/api/q/create_question", {
				question,
			})
			.then((res) => {
				dispatch({ type: GET_QUESTIONS_SUCCESS });
			})
			.catch((err) => {
				console.error(err);
				dispatch({ type: GET_QUESTIONS_ERROR });
			});
	};
};
