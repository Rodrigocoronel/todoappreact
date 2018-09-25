import { combineReducers } from "redux";

import auth from "./auth.js";
import dash from "./dash.js";


const reducers = combineReducers({
	auth,
	dash,

});

export default reducers;