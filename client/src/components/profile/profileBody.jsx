import React from "react";
import PropTypes from "prop-types";

import PostItem from "../../components/posts/postItem";

const ProfileHeader = ({ profile: { posts, goal, social } }) => {
  return (
    <div className="profile-container__body">
      {posts.map(post => (
        <PostItem key={post._id} post={post.post} />
      ))}
    </div>
  );
};

ProfileHeader.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileHeader;
