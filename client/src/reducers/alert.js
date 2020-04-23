import { SET_ALERT, REMOVE_ALERT } from '../actions/types';
const intialState = [];
// @Note: payload means data
export default function (state = intialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      //   Will remove all alert except that matches the payload
      return state.filter((alert) => {
        if (alert.id !== payload) {
          return alert;
        }
      });
    default:
      return state;
  }
}
