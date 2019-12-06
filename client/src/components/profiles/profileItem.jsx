import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { followUserById } from "../../redux/actions/profiles";
import PropTypes from "prop-types";

import sprite from "../../assets/img/sprite.svg";

const ProfileItem = ({
  auth,
  followUserById,
  profile: {
    user: { _id, name, username, avatar, groups },
    bio,
    location,
    followers,
    status,
    hobbies,
    interests
  }
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
          Followers: {followers.length}
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
            (followers.find(follower => follower.user === auth.user._id) ? (
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
            ))}
        </div>
      </div>
    </div>
  </div>
);

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
  followUserById: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profiles: state.profiles
});

export default connect(mapStateToProps, { followUserById })(ProfileItem);
