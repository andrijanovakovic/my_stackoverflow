/**
 * reducer logic is here
 */

import { combineReducers } from "redux";

/**
 * import your reducers below
 */
import AuthReducer from "./AuthReducer";
import CoreReducer from "./CoreReducer";

export default combineReducers({
	auth: AuthReducer,
	core: CoreReducer,
});
