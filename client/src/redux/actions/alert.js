import { SET_ALERT, REMOVE_ALERT } from "./types";
const uuidv4 = require("uuid/v4");

// this is the function for the alert that takes in a message, alertType, and a timeout with a default time value
// we also pass in dispatch so we can dispatch the alert
export const setAlert = (msg, alertType, timeout = 3000) => dispatch => {
  // generate unique id for the alert
  const id = uuidv4();
  // send a dispatch of type SET_ALERT
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });
  // after 5 seconds, we will send a dispatch of type REMOVE_ALERT
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
