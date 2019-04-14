import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import CombinedReducers from "./reducers/index";
import axios from "axios";
import { AUTHENTICATE_USER } from "./types/AuthTypes";
import jwt_decode from "jwt-decode";
import { reset_auth_reducer_to_init } from "./actions/AuthActions";

const store = createStore(CombinedReducers, {}, applyMiddleware(reduxThunk));

const token = localStorage.getItem("token");

// set axios defaults
axios.defaults.headers.post["Content-Type"] = "appication/json";
if (token && token !== "" && token !== "null") {
	axios.defaults.headers.common.authorization = `Bearer ${token}`;
	store.dispatch({ type: AUTHENTICATE_USER, payload: jwt_decode(token) });
}
axios.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response && error.response.status && error.response.status === 401) {
			localStorage.clear();
			store.dispatch(reset_auth_reducer_to_init());
		}
		return Promise.reject(error);
	},
);

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
