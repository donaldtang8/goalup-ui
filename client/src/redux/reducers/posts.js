import {
  GET_POSTS,
  ADD_POST,
  DELETE_POST,
  UPDATE_LIKES,
  ADD_COMMENT,
  REMOVE_COMMENT,
  UPDATE_COMMENT_LIKES,
  POST_ERROR
} from "../actions/types";

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false
      };
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== payload),
        loading: false
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.postId ? { ...post, likes: payload.likes } : post
        ),
        post: { ...state.post, likes: payload.likes },
        loading: false
      };
    case ADD_COMMENT:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.postId
            ? { ...post, comments: payload.comments }
            : post
        ),
        post: { ...state.post, comments: payload.comments },
        loading: false
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.postId
            ? { ...post, comments: payload.comments }
            : post
        ),
        // post: {
        //   ...state.post,
        //   comments: state.post.comments.filter(
        //     comment => comment._id !== payload
        //   )
        // },
        loading: false
      };
    case UPDATE_COMMENT_LIKES:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.postId
            ? {
                ...post,
                comments: post.comments.map(comment =>
                  comment._id === payload.commentId
                    ? { ...comment, likes: payload.likes }
                    : comment
                )
              }
            : post
        ),
        loading: false
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}
