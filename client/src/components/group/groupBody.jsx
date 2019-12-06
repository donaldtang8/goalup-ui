import React from "react";
import PropTypes from "prop-types";

import PostItem from "../../components/posts/postItem";

const GroupBody = ({ group }) => {
  return (
    <div className="group-container__body">
      {group.posts.map(post => (
        <PostItem
          key={post._id}
          post={post.post}
          group={group}
          medium="group"
        />
      ))}
    </div>
  );
};

GroupBody.propTypes = {
  group: PropTypes.object.isRequired
};

export default GroupBody;
