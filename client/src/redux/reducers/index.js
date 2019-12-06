import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import auth from "./auth";
import alert from "./alert";
import posts from "./posts";
import profiles from "./profiles";
import groups from "./groups";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["notifications"]
};

const rootReducer = combineReducers({
  auth: auth,
  alert: alert,
  posts: posts,
  profiles: profiles,
  groups: groups
});

export default persistReducer(persistConfig, rootReducer);
