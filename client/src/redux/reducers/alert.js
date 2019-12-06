import { SET_ALERT, REMOVE_ALERT } from "../actions/types";
const initialState = [];

// reducer function will take in a state and an action
export default function(state = initialState, action) {
  const { type, payload } = action;
  // we need to evaluate the action and handle each type of action accordingly
  // we grab the dispatch and evaluate the type
  switch (type) {
    // we match the dispatch type
    case SET_ALERT:
      // this will add a new alert to the array and return the array with the payload with the new alert
      return [...state, payload];
    case REMOVE_ALERT:
      // filter through and return all alerts except the one that matches the payload
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
}
