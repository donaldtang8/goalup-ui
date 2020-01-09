import React from "react";

import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { sendFriendRequest, unfriend } from "../../redux/actions/users";

import Moment from "react-moment";
import PropTypes from "prop-types";
import sprite from "../../assets/img/sprite.svg";

const ProfileHeader = ({
  auth,
  sendFriendRequest,
  unfriend,
  profile: {
    bio,
    location,
    status,
    goal,
    social,
    date,
    friends,
    user: { _id, name, username, avatar }
  },
  user: { friend_sent_requests, friend_received_requests }
}) => {
  return (
    <div className="profile-container__header">
      <div className="profile-container__header--banner"></div>
      <div className="profile-container__header--picture">
        <img
          src={avatar}
          alt={name}
          className="profile-container__header--img"
        />
      </div>
      <div className="profile-container__header--section">
        <div className="profile-container__header--side">
          <div className="profile-container__header--actions">
            <div className="profile-container__header--actions-item">
              {_id !== auth.user._id ? (
                friends.find(friend => friend.user === auth.user._id) ? (
                  <div
                    className="btn-small btn-small--primary"
                    onClick={() => unfriend(_id)}
                  >
                    Unfriend
                  </div>
                ) : friend_received_requests.find(
                    friend => friend.user === _id
                  ) ? (
                  <Link to="/friends" className="btn-small btn-small--primary">
                    Respond to Request
                  </Link>
                ) : friend_sent_requests.find(friend => friend.user === _id) ? (
                  <div className="btn-small btn-small--primary">
                    Sent Request
                  </div>
                ) : (
                  <div
                    className="btn-small btn-small--primary"
                    onClick={() => sendFriendRequest(_id)}
                  >
                    Friend
                  </div>
                )
              ) : (
                <Link to="/profile/:id/edit-profile">
                  <div className="btn-small btn-small--primary">
                    Edit Profile
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* ------------------------------------- */}
        <div className="profile-container__header--bio">
          <div className="profile-container__header--name">{name}</div>
          <div className="profile-container__header--username">{`@${username}`}</div>
          <div className="profile-container__header--biography">{bio}</div>
          <div className="profile-container__header--bio-item">
            <div className="profile-container__header--location">
              <svg className="profile-container__header--icon">
                <use xlinkHref={`${sprite}#icon-location-pin`}></use>
              </svg>
              {location}
            </div>
            <div className="profile-container__header--date">
              <svg className="profile-container__header--icon">
                <use xlinkHref={`${sprite}#icon-calendar`}></use>
              </svg>
              <Moment format="MM//DD/YYYY">{date}</Moment>
            </div>
          </div>
          <div className="profile-container__header--bio-item">
            <div className="profile-container__header--followers">
              <div className="bold">{friends.length} </div>
              <div className="padding-small">Friends</div>
            </div>
          </div>
        </div>
        {/* ------------------------------------- */}
      </div>
    </div>
  );
};

ProfileHeader.propTypes = {
  profile: PropTypes.object.isRequired,
  sendFriendRequest: PropTypes.func.isRequired,
  unfriend: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.auth.user
});

export default connect(mapStateToProps, { sendFriendRequest, unfriend })(
  ProfileHeader
);
