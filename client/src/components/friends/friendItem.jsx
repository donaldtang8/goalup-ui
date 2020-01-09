import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import {
  respondToFriendRequest,
  getMutualFriends
} from "../../redux/actions/users";

import PropTypes from "prop-types";

const FriendItem = ({ auth: { user }, friend, respondToFriendRequest }) => {
  useEffect(() => {}, []);

  const respondRequest = (e, response) => {
    e.preventDefault();
    respondToFriendRequest(friend.user, { response });
  };

  return (
    <div className="friendRequestItem">
      <div className="friendRequestItem__header">
        <Link to={`/profiles/${friend.user}`}>
          <div className="friendRequestItem__header--avatar">
            <img
              src={friend.avatar}
              alt={friend.name}
              className="friendRequestItem__header--img"
            />
          </div>
          <div className="friendRequestItem__header--name">{friend.name}</div>
          <div className="friendRequestItem__header--username">{`@${friend.username}`}</div>
        </Link>
      </div>
      <div className="friendRequestItem__main">
        <div className="friendRequestItem__details">
          <div className="friendRequestItem__details--item"></div>
        </div>
        <div className="friendRequestItem__body">
          <div className="friendRequestItem__body--item">Mutual Friends</div>
        </div>
        <div className="friendRequestItem__actions">
          <div className="friendRequestItem__actions--item">
            <div
              className="btn-small btn-small--primary"
              onClick={e => respondRequest(e, "accept")}
            >
              Accept
            </div>
            <div
              className="btn-small btn-small--primary"
              onClick={e => respondRequest(e, "reject")}
            >
              Reject
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FriendItem.propTypes = {
  friend: PropTypes.object.isRequired,
  respondToFriendRequest: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { respondToFriendRequest })(FriendItem);
