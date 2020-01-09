import {
  GET_PROFILE,
  GET_PROFILES,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  PROFILE_ERROR,
  UNFRIEND
} from "../actions/types";

const initialState = {
  profile: null,
  profiles: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return { ...state, profile: payload, loading: false, error: {} };
    case GET_PROFILES:
      return { ...state, profiles: payload, loading: false, error: {} };
    case CLEAR_PROFILE:
      return { ...state, profile: null, loading: false };
    case PROFILE_ERROR:
      return { ...state, profile: null, error: payload, loading: false };
    case UNFRIEND:
      return {
        ...state,
        profile: {
          ...state.profile,
          friends: payload.friends
        },
        loading: false
      };
    default:
      return state;
  }
}
