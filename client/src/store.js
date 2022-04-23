import { createStore, combineReducers } from "redux";
import search from "./reducer/search";
import currency from "./reducer/currency";
import cartPrice from "./reducer/cartPrice";

const rootReducer = combineReducers({
    search,
    currency,
    cartPrice
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
