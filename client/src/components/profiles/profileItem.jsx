import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { sendFriendRequest, unfriend } from "../../redux/actions/users";

import PropTypes from "prop-types";

import sprite from "../../assets/img/sprite.svg";

const ProfileItem = ({
  auth,
  sendFriendRequest,
  profile: {
    user: { _id, name, username, avatar, groups },
    bio,
    location,
    friends,
    status,
    hobbies,
    interests
  },
  user: { friend_sent_requests, friend_received_requests }
}) => (
  <div className="profileItem">
    <div className="profileItem__header">
      <Link to={`/profiles/${_id}`}>
        <div className="profileItem__header--avatar">
          <img src={avatar} alt={name} className="profileItem__header--img" />
        </div>
        <div className="profileItem__header--name">{name}</div>
        <div className="profileItem__header--username">{`@${username}`}</div>
      </Link>
    </div>
    <div className="profileItem__main">
      <div className="profileItem__details">
        <div className="profileItem__details--item">
          Friends: {friends.length}
        </div>
        <div className="profileItem__details--item">
          Groups: {groups.length}
        </div>
      </div>
      <div className="profileItem__body">
        <div className="profileItem__body--item">
          <svg className="profileItem__body--icon">
            <use xlinkHref={`${sprite}#icon-pin`}></use>
          </svg>
          {status ? <span>{status}</span> : <span>No Status</span>}
        </div>
        <div className="profileItem__body--item">
          <svg className="profileItem__body--icon">
            <use xlinkHref={`${sprite}#icon-location-pin`}></use>
          </svg>
          {location ? <span>{location}</span> : <span>Secret Location</span>}
        </div>
        <div className="profileItem__body--item">
          <svg className="profileItem__body--icon">
            <use xlinkHref={`${sprite}#icon-globe`}></use>
          </svg>
          {bio && <span>{bio}</span>}
        </div>
      </div>
      <div className="profileItem__actions">
        <div className="profileItem__actions--item">
          {_id !== auth.user._id &&
            friends.find(friend => friend.user === auth.user._id) && (
              <div
                className="btn-small btn-small--primary"
                onClick={() => unfriend(_id)}
              >
                Unfriend
              </div>
            )}
          {_id !== auth.user._id &&
            friend_received_requests.find(friend => friend.user === _id) && (
              <Link to="/friends" className="btn-small btn-small--primary">
                Respond to Request
              </Link>
            )}
          {_id !== auth.user._id &&
            friend_sent_requests.find(friend => friend.user === _id) && (
              <div className="btn-small btn-small--primary">Sent Request</div>
            )}
          {_id !== auth.user._id &&
            !friend_received_requests.find(friend => friend.user === _id) &&
            !friend_sent_requests.find(friend => friend.user === _id) &&
            !friends.find(friend => friend.user === auth.user._id) && (
              <div
                className="btn-small btn-small--primary"
                onClick={() => sendFriendRequest(_id)}
              >
                Friend
              </div>
            )}
        </div>
      </div>
    </div>
  </div>
);

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
  sendFriendRequest: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.auth.user,
  profiles: state.profiles
});

export default connect(mapStateToProps, { sendFriendRequest })(ProfileItem);
