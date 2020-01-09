import {
  GET_NOTIFICATIONS,
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  UPDATE_NOTIFICATION,
  NOTIFICATION_ERROR
} from "../actions/types";

const initialState = {
  notifications: [],
  notification: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_NOTIFICATIONS:
      return {
        ...state,
        posts: payload,
        loading: false
      };
    case ADD_NOTIFICATION:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false
      };
    case REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.posts.filter(
          notification => notification._id !== payload
        ),
        loading: false
      };
    case UPDATE_NOTIFICATION:
      return {
        ...state,
        notifications: state.posts.map(notification =>
          notification._id === payload.notificationId
            ? {
                ...notification,
                viewed: payload.viewed,
                opened: payload.opened
              }
            : notification
        ),
        notification: {
          ...state.notification,
          viewed: payload.viewed,
          opened: payload.opened
        },
        loading: false
      };
    case NOTIFICATION_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}
