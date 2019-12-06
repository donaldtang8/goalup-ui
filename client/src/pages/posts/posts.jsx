import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getPosts } from "../../redux/actions/posts";
import PropTypes from "prop-types";

import PostForm from "../../components/posts/postForm";
import PostItem from "../../components/posts/postItem";

const Posts = ({ getPosts, posts: { posts, loading } }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div className="posts-container">
      <PostForm medium="post" />
      <div className="postsItems-container">
        {posts.map(post => (
          <PostItem key={post._id} post={post} medium="post" />
        ))}
      </div>
    </div>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  posts: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  posts: state.posts
});

export default connect(mapStateToProps, { getPosts })(Posts);
