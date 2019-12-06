import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import sprite from "../../assets/img/sprite.svg";

import {
  removePost,
  addLike,
  addComment,
  removeComment,
  addLikeComment
} from "../../redux/actions/posts";

import {
  removeGroupPost,
  addGroupLike,
  addGroupComment,
  removeGroupComment,
  addGroupLikeComment
} from "../../redux/actions/groups";

import Moment from "react-moment";

const PostItem = ({
  medium,
  auth,
  post: { _id, text, user, likes, comments, name, avatar, date },
  group,
  removePost,
  addLike,
  addComment,
  removeComment,
  addLikeComment,
  removeGroupPost,
  addGroupLike,
  addGroupComment,
  removeGroupComment,
  addGroupLikeComment
}) => {
  const [showComment, toggleShowComment] = useState(false);
  const [commentText, setCommentText] = useState("");

  const onCommentChange = e => {
    setCommentText(e.target.value);
  };

  const onCommentSubmit = e => {
    e.preventDefault();
    if (medium === "post") {
      addComment(_id, { commentText });
    } else {
      addGroupComment(_id, { commentText });
    }
    setCommentText("");
  };

  return (
    <div className="postItem">
      <div className="postItem__header">
        <div className="postItem__header--user">
          {auth && auth.user && (
            <Link to={`/profiles/${auth.user._id}`}>
              <img src={avatar} alt={user} className="postItem__header--img" />
            </Link>
          )}
          <div className="postItem__header--block">
            <div className="postItem__header--name">{name}</div>
            <div className="postItem__header--time">
              <Moment fromNow>{date}</Moment>
            </div>
          </div>
        </div>
      </div>
      <div className="postItem__body">{text}</div>
      <div className="postItem__actions">
        <div
          className="postItem__actions--button"
          onClick={() => {
            medium === "post" ? addLike(_id) : addGroupLike(_id);
          }}
        >
          {auth.user && (
            <svg
              className={
                likes.find(like => like.user === auth.user._id)
                  ? "postItem__actions--icon--heart"
                  : "postItem__actions--icon"
              }
            >
              <use xlinkHref={`${sprite}#icon-heart`}></use>
            </svg>
          )}
          <div className="postItem__actions--button--text">{likes.length}</div>
        </div>
        <div
          className="postItem__actions--button"
          onClick={() => toggleShowComment(!showComment)}
        >
          <svg
            className={
              showComment
                ? "postItem__actions--icon--show"
                : "postItem__actions--icon"
            }
          >
            <use xlinkHref={`${sprite}#icon-chat`}></use>
          </svg>
          <div className="postItem__actions--button--text">
            {comments.length}
          </div>
        </div>
        <div className="postItem__actions--button">
          {!auth.loading && auth.user && user === auth.user._id ? (
            <svg
              className="postItem__actions--icon"
              onClick={() => {
                medium === "post"
                  ? removePost(_id)
                  : removeGroupPost(group._id, _id);
              }}
            >
              <use xlinkHref={`${sprite}#icon-trash`}></use>
            </svg>
          ) : (
            <svg className="postItem__actions--icon">
              <use xlinkHref={`${sprite}#icon-flag`}></use>
            </svg>
          )}
        </div>
      </div>
      <div
        className="postItem__comments"
        style={
          showComment === true ? { display: "block" } : { display: "none" }
        }
      >
        {comments.map(comment => (
          <div key={comment._id} className="postItem__comments-item">
            <div className="postItem__comments--header">
              <img
                src={comment.avatar}
                alt={comment.name}
                className="postItem__comments--img"
              />
              <div className="postItem__comments--block">
                <div className="postItem__comments--name">{comment.name}</div>
              </div>
            </div>
            <div className="postItem__comments--body">
              <div className="postItem__comments--text">{comment.text}</div>
              <div className="postItem__comments--actions">
                <div
                  className="postItem__comments--button"
                  onClick={() => {
                    medium === "post"
                      ? addLikeComment(_id, comment._id)
                      : addGroupLikeComment(_id);
                  }}
                >
                  {auth.user && (
                    <svg
                      className={
                        comment.likes.find(like => like.user === auth.user._id)
                          ? "postItem__comments--action--heart"
                          : "postItem__comments--action"
                      }
                      onClick={() => {
                        medium === "post"
                          ? addLikeComment(_id, comment._id)
                          : addGroupLikeComment(_id);
                      }}
                    >
                      <use xlinkHref={`${sprite}#icon-heart`}></use>
                    </svg>
                  )}
                  <div className="postItem__comments--button--text">
                    {comment.likes.length}
                  </div>
                </div>
                {auth.user && auth.user._id === comment.user && (
                  <div
                    className="postItem__comments--button"
                    onClick={() => {
                      medium === "post"
                        ? removeComment(_id, comment._id)
                        : removeGroupComment(_id, comment._id);
                    }}
                  >
                    <svg className="postItem__comments--action">
                      <use xlinkHref={`${sprite}#icon-trash`}></use>
                    </svg>
                  </div>
                )}
              </div>
              <div className="postItem__comments--time">
                <Moment fromNow>{comment.date}</Moment>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="postItem__postComment">
        <div className="postItem__postComment--header">
          {auth && auth.user && (
            <img
              src={auth.user.avatar}
              alt={auth.user.name}
              className="postItem__postComment--img"
            />
          )}
        </div>
        <div className="postItem__postComment--form-box">
          <form
            className="postItem__postComment--form"
            onSubmit={onCommentSubmit}
          >
            <input
              type="text"
              className="postItem__postComment--input"
              placeholder="Post a comment"
              name="commentText"
              value={commentText}
              onChange={onCommentChange}
              required
            />
          </form>
        </div>
      </div>
    </div>
  );
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  group: PropTypes.object,
  removePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  removeComment: PropTypes.func.isRequired,
  addLikeComment: PropTypes.func.isRequired,
  removeGroupPost: PropTypes.func.isRequired,
  addGroupLike: PropTypes.func.isRequired,
  addGroupComment: PropTypes.func.isRequired,
  removeGroupComment: PropTypes.func.isRequired,
  addGroupLikeComment: PropTypes.func.isRequired,
  medium: PropTypes.string
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  removePost,
  addLike,
  addComment,
  removeComment,
  addLikeComment,
  removeGroupPost,
  addGroupLike,
  addGroupComment,
  removeGroupComment,
  addGroupLikeComment
})(PostItem);
