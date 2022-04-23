import { CHANGE_TOTAL_PRICE } from "../action.types";

export default (state=0, action) => {
  switch (action.type) {
    case CHANGE_TOTAL_PRICE:
      return action.payload;
    default:
      return state;
  }
};
