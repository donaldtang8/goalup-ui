import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_NOTIFICATIONS,
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  UPDATE_NOTIFICATION,
  NOTIFICATION_ERROR
} from "./types";

// Retrieve all notifications
export const getUserNotifications = () => async dispatch => {
  try {
    const res = await axios.get("/api/notifications");
    dispatch({
      type: GET_NOTIFICATIONS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Remove notification by id
export const removeNotificationById = notifId => async dispatch => {
  try {
    const res = await axios.delete(`/api/notifications/${notifId}`);
    dispatch({
      type: REMOVE_NOTIFICATION,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
