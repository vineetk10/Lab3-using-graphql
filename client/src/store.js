import { createStore, combineReducers } from "redux";
import search from "./reducer/search";

const rootReducer = combineReducers({
    search,
});

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
    serialize: { 
      options: {
       undefined: true,
       function: function(fn) { return fn.toString() }
      }
    }
  }));

export default store;
