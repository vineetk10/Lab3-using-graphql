import { CHANGE_CURRENCY } from "../action.types";

export default (state, action) => {
  switch (action.type) {
    case CHANGE_CURRENCY:
      return action.payload;
    default:
      return state;
  }
};
