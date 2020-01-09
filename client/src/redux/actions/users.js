import axios from "axios";
import { setAlert } from "./alert";
import { FRIEND_REQUEST, FRIEND_RESPOND, UNFRIEND, AUTH_ERROR } from "./types";

// send friend request
export const sendFriendRequest = userId => async dispatch => {
  try {
    const res = await axios.post(`/api/users/friend/${userId}`);
    dispatch({
      type: FRIEND_REQUEST,
      payload: { userId, requests: res.data }
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// respond to request
export const respondToFriendRequest = (
  userId,
  respondData
) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post(
      `/api/users/friendResponse/${userId}`,
      respondData,
      config
    );
    dispatch({
      type: FRIEND_RESPOND,
      payload: { userId, requests: res.data }
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// unfriend user
export const unfriend = userId => async dispatch => {
  try {
    const res = await axios.post(`/api/users/unfriend/${userId}`);
    dispatch({
      type: UNFRIEND,
      payload: { userId, friends: res.data }
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// get mutual friends
export const getMutualFriends = userId => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.get(
      `/api/users/getMutualFriends/${userId}`,
      config
    );
    dispatch({
      type: FRIEND_RESPOND,
      payload: { userId, requests: res.data }
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
