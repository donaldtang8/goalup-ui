import React from "react";

import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { followUserById } from "../../redux/actions/profiles";

import Moment from "react-moment";
import PropTypes from "prop-types";
import sprite from "../../assets/img/sprite.svg";

const ProfileHeader = ({
  auth,
  followUserById,
  profile: {
    bio,
    location,
    status,
    goal,
    followers,
    following,
    social,
    date,
    user: { _id, name, username, avatar }
  }
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
                followers.find(follower => follower.user === auth.user._id) ? (
                  <div
                    className="btn-small btn-small--primary"
                    onClick={() => followUserById(_id)}
                  >
                    Unfollow
                  </div>
                ) : (
                  <div
                    className="btn-small btn-small--primary"
                    onClick={() => followUserById(_id)}
                  >
                    Follow
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
              <div className="bold">{followers.length} </div>
              <div className="padding-small">Followers</div>
            </div>
            <div className="profile-container__header--following">
              <div className="bold">{following.length} </div>
              <div className="padding-small"> Following</div>
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
  followUserById: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { followUserById })(ProfileHeader);
