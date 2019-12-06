import React, { useState } from "react";
import { connect } from "react-redux";
import { addPost } from "../../redux/actions/posts";
import { addGroupPost } from "../../redux/actions/groups";
import PropTypes from "prop-types";

const PostForm = ({ medium, group, auth: { user }, addPost, addGroupPost }) => {
  const [postText, setPostText] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (medium === "post") {
      addPost({ postText });
    } else {
      addGroupPost(group._id, { postText });
    }

    setPostText("");
  };

  const handleChange = e => {
    setPostText(e.target.value);
  };

  return (
    <div className="postForm-container">
      <div className="postForm-container--top">
        {user && (
          <img
            src={user.avatar}
            alt={user.name}
            className="postForm-container--img"
          />
        )}
        <form className="postForm-container--form">
          <textarea
            name="text"
            placeholder="What are you doing today?"
            value={postText}
            onChange={handleChange}
            maxLength="250"
            required
          ></textarea>
        </form>
      </div>
      <div className="postForm-container--bottom">
        <div
          className="btn-small btn-small--primary"
          onClick={e => handleSubmit(e)}
        >
          Post
        </div>
      </div>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  addGroupPost: PropTypes.func.isRequired,
  medium: PropTypes.string.isRequired,
  group: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addPost, addGroupPost })(PostForm);
