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
} from "../actions/types";

const initialState = {
  group: null,
  joinedGroups: [],
  groups: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_GROUP:
    case UPDATE_GROUP:
      return { ...state, group: payload, loading: false, error: {} };
    case GET_MYGROUPS:
      return { ...state, joinedGroups: payload, loading: false, error: {} };
    case GET_GROUPS:
      return { ...state, groups: payload, loading: false, error: {} };
    case CLEAR_GROUP:
      return { ...state, group: null, loading: false };
    case JOIN_GROUP:
      return {
        ...state,
        group: payload.group,
        groups: state.groups.map(group =>
          group._id === payload.groupId
            ? {
                ...group,
                members: payload.group.members
              }
            : group
        ),
        loading: false
      };
    case GET_GROUP_POSTS:
      return {
        ...state,
        group: { ...state.group, posts: payload.posts },
        loading: false
      };
    case ADD_GROUP_POST:
      return {
        ...state,
        group: { ...state.group, posts: payload },
        loading: false
      };
    case DELETE_GROUP_POST:
      return {
        ...state,
        group: {
          ...state.group,
          posts: state.group.posts.filter(post => post.post._id !== payload)
        },
        loading: false
      };
    case UPDATE_GROUP_LIKES:
      return {
        ...state,
        group: {
          ...state.group,
          posts: state.group.posts.map(post =>
            post.post._id === payload.postId
              ? {
                  ...post,
                  post: { ...post.post, likes: payload.likes }
                }
              : post
          )
        },
        loading: false
      };
    case ADD_GROUP_COMMENT:
    case REMOVE_GROUP_COMMENT:
      return {
        ...state,
        group: {
          ...state.group,
          posts: state.group.posts.map(post =>
            post.post._id === payload.postId
              ? {
                  ...post,
                  post: { ...post.post, comments: payload.comments }
                }
              : post
          )
        },
        loading: false
      };
    case UPDATE_GROUP_COMMENT_LIKES:
      return {
        ...state,
        group: {
          ...state.group,
          posts: state.group.posts.map(post =>
            post.post._id === payload.postId
              ? {
                  ...post,
                  post: {
                    ...post.post,
                    comments: post.post.comments.map(comment =>
                      comment._id === payload.commentId
                        ? { ...comment, likes: payload.likes }
                        : comment
                    )
                  }
                }
              : post
          )
        },
        loading: false
      };
    case GROUP_ERROR:
      return { ...state, group: null, error: payload, loading: false };
    default:
      return state;
  }
}
