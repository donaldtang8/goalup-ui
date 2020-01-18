import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_GROUP,
  GET_MYGROUPS,
  GET_GROUPS,
  UPDATE_GROUP,
  CLEAR_GROUP,
  JOIN_GROUP,
  GROUP_ERROR,
  GET_GROUP_POSTS,
  ADD_GROUP_POST,
  DELETE_GROUP_POST,
  UPDATE_GROUP_LIKES,
  ADD_GROUP_COMMENT,
  REMOVE_GROUP_COMMENT,
  UPDATE_GROUP_COMMENT_LIKES
} from "./types";

// Get groups user is joined in
export const getJoinedGroups = () => async dispatch => {
  try {
    const res = await axios.get("/api/groups/me");
    dispatch({
      type: GET_MYGROUPS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get all groups
export const getGroups = () => async dispatch => {
  // clear old profile before getting new ones
  dispatch({ type: CLEAR_GROUP });
  try {
    const res = await axios.get("api/groups/");
    dispatch({
      type: GET_GROUPS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get profile by id
export const getGroupById = groupId => async dispatch => {
  try {
    const res = await axios.get(`/api/groups/${groupId}`);
    dispatch({
      type: GET_GROUP,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const joinGroupById = groupId => async dispatch => {
  try {
    const res = await axios.put(`/api/groups/join/${groupId}`);
    dispatch({
      type: JOIN_GROUP,
      payload: { groupId, group: res.data }
    });
    dispatch(getGroupById(groupId));
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get group posts
// Retrieve all posts
export const getGroupPosts = groupId => async dispatch => {
  try {
    const res = await axios.get(`/api/groups/${groupId}/posts`);
    dispatch({
      type: GET_GROUP_POSTS,
      payload: { groupId, posts: res.data }
    });
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create a new post
export const addGroupPost = (groupId, postData) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post(`/api/groups/${groupId}`, postData, config);
    dispatch({
      type: ADD_GROUP_POST,
      payload: res.data
    });
    console.log(res.data);
    dispatch(setAlert("Post created", "success"));
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Remove post
export const removeGroupPost = (groupId, postId) => async dispatch => {
  try {
    await axios.delete(`/api/groups/${groupId}/${postId}`);
    dispatch({
      type: DELETE_GROUP_POST,
      payload: postId
    });
    dispatch(setAlert("Post deleted", "success"));
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add like
export const addGroupLike = postId => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/like/${postId}`);
    dispatch({
      type: UPDATE_GROUP_LIKES,
      payload: { postId, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Remove like
export const removeGroupLike = postId => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/unlike/${postId}`);
    dispatch({
      type: UPDATE_GROUP_LIKES,
      payload: { postId, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create comment
export const addGroupComment = (postId, commentData) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post(
      `/api/posts/comment/${postId}`,
      commentData,
      config
    );
    dispatch({
      type: ADD_GROUP_COMMENT,
      payload: { postId, comments: res.data }
    });
    dispatch(setAlert("Comment added", "success"));
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Remove comment
export const removeGroupComment = (postId, commentId) => async dispatch => {
  try {
    const res = await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
    console.log(res.data);
    dispatch({
      type: REMOVE_GROUP_COMMENT,
      payload: { postId: postId, commentId: commentId, comments: res.data }
    });
    dispatch(setAlert("Comment Removed", "success"));
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add like to comment
export const addGroupLikeComment = (postId, commentId) => async dispatch => {
  try {
    const res = await axios.put(
      `/api/posts/comment/like/${postId}/${commentId}`
    );
    dispatch({
      type: UPDATE_GROUP_COMMENT_LIKES,
      payload: { postId, commentId, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Remove like from comment
export const removeGroupUnlikeComment = (
  postId,
  commentId
) => async dispatch => {
  try {
    const res = await axios.put(
      `/api/posts/comment/unlike/${postId}/${commentId}`
    );
    dispatch({
      type: UPDATE_GROUP_COMMENT_LIKES,
      payload: { postId, commentId, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// create group
export const createGroup = (
  groupData,
  history,
  edit = false
) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const res = await axios.post("/api/groups", groupData, config);
    dispatch({
      type: GET_GROUP,
      payload: res.data
    });

    dispatch(setAlert(edit ? "Group Updated" : "Group Created", "success"));
    // if created profile for the first time, redirect to posts
    if (!edit) {
      history.push("/groups");
    }
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// update group
export const editGroup = (
  groupId,
  groupData,
  history,
  edit = false
) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const res = await axios.put(`/api/groups/${groupId}`, groupData, config);
    dispatch({
      type: UPDATE_GROUP,
      payload: res.data
    });

    dispatch(setAlert(edit ? "Group Updated" : "Group Created", "success"));
    history.push("/groups");
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const deleteGroup = (groupId, history) => async dispatch => {
  if (window.confirm("Are you sure? This can not be undone!")) {
    try {
      await axios.delete(`/api/groups/${groupId}`);
      dispatch({
        type: CLEAR_GROUP,
        payload: groupId
      });
      dispatch(setAlert("Your group has been permanently deleted"));
      history.push("/groups");
    } catch (err) {
      console.log(err);
      dispatch({
        type: GROUP_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};
