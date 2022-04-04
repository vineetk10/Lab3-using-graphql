import { CHANGE_SEARCH } from "../action.types";

export default (state='', action) => {
  switch (action.type) {
    case CHANGE_SEARCH:{
      return action.payload;
    }
    default:
      return state;
  }
};
