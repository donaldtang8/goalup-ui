import axios from "axios";
import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
  TOGGLE_DROPDOWN
} from "./types";
import setAuthToken from "../../utils/setAuthToken";

import { getUserNotifications } from "../actions/notifications";

// Login user
export const login = (email, password, history) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post("/api/users/login", body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    await dispatch(loadUser());
    await dispatch(getUserNotifications());
    history.push("/");
  } catch (err) {
    if (err.response) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: LOGIN_FAIL,
        payload: errors
      });
    }
  }
};

// Logout user
export const logout = () => dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};

// Register user
export const register = ({
  name,
  username,
  email,
  password,
  history
}) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const body = JSON.stringify({ name, username, email, password });
  try {
    const res = await axios.post("/api/users/register", body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
    history.push("/create-profile");
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: REGISTER_FAIL,
      payload: errors
    });
  }
};

// Load a user if there exists a token in local storage
export const loadUser = () => async dispatch => {
  // check if there is already an existing token
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get("/api/users/");
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// toggleDropdown
export const toggleDropdown = () => async dispatch => {
  try {
    dispatch({
      type: TOGGLE_DROPDOWN,
      payload: ""
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};
