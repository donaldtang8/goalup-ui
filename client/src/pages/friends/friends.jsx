import React from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";

import FriendItem from "../../components/friends/friendItem";

const Friends = ({ auth: { user } }) => {
  return (
    <div className="friends-container">
      {user.friend_received_requests.length > 0 && (
        <div className="heading-tertiary"></div>
      )}
      <div className="friendsItems-container">
        {user.friend_received_requests.length > 0 ? (
          user.friend_received_requests.map(request => (
            <FriendItem key={request._id} friend={request} />
          ))
        ) : (
          <div className="paragraph center">No friend requests found...</div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, null)(Friends);
