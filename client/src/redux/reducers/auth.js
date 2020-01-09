import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED,
  TOGGLE_DROPDOWN,
  FRIEND_REQUEST,
  FRIEND_RESPOND,
  UNFRIEND
} from "../actions/types";

const initialState = {
  // access local storage and look for token
  token: localStorage.getItem("token"),
  // set isAuthenticated to null initially until after call is made to check
  isAuthenticated: null,
  hasProfile: false,
  // once we have made the request to the server, then we will set this to false
  loading: true,
  user: null,
  showUserDropdown: false,
  errors: []
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        hasProfile: payload.hasProfile,
        loading: false,
        user: payload
      };
    case AUTH_ERROR:
      localStorage.removeItem("token");
      return { ...state, token: null, isAuthenticated: false, loading: false };
    case TOGGLE_DROPDOWN:
      return { ...state, showUserDropdown: !state.showUserDropdown };
    case FRIEND_REQUEST:
      return {
        ...state,
        user: {
          ...state.user,
          friend_sent_requests: payload.requests
        },
        loading: false
      };
    case FRIEND_RESPOND:
      return {
        ...state,
        user: {
          ...state.user,
          friend_received_requests: payload.requests
        },
        loading: false
      };
    case UNFRIEND:
      return {
        ...state,
        user: {
          ...state.user,
          friends: payload.friends
        },
        loading: false
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        user: payload.user,
        errors: []
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        errors: payload
      };
    case LOGOUT:
    case ACCOUNT_DELETED:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        errors: []
      };
    default:
      return state;
  }
}
