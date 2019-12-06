import React from "react";

import { connect } from "react-redux";
import { joinGroupById } from "../../redux/actions/groups";

import Moment from "react-moment";
import PropTypes from "prop-types";
import sprite from "../../assets/img/sprite.svg";

const GroupHeader = ({
  auth,
  joinGroupById,
  group: {
    _id,
    name,
    description,
    creator,
    admins,
    members,
    posts,
    date,
    hobbies,
    interests
  }
}) => {
  return (
    <div className="group-container__header">
      <div className="group-container__header--banner">Banner here</div>
      <div className="group-container__header--picture">
        {auth && auth.user && (
          <img
            src={auth.user.avatar}
            alt={name}
            className="group-container__header--img"
          />
        )}
      </div>
      <div className="group-container__header--section">
        <div className="group-container__header--side">
          <div className="group-container__header--actions">
            <div className="group-container__header--actions-item">
              {creator !== auth.user._id ? (
                members.find(member => member.user._id === auth.user._id) ? (
                  <div
                    className="btn-small btn-small--primary"
                    onClick={() => joinGroupById(_id)}
                  >
                    Leave
                  </div>
                ) : (
                  <div
                    className="btn-small btn-small--primary"
                    onClick={() => joinGroupById(_id)}
                  >
                    Join
                  </div>
                )
              ) : (
                <div className="btn-small btn-small--primary">Edit group</div>
              )}
            </div>
          </div>
        </div>
        {/* ------------------------------------- */}
        <div className="group-container__header--bio">
          <div className="group-container__header--name">{name}</div>
          {/* <div className="group-container__header--creator">{`@${username}`}</div> */}
          <div className="group-container__header--description">
            {description}
          </div>
          <div className="group-container__header--bio-item">
            <div className="group-container__header--date padding-small">
              <svg className="group-container__header--icon">
                <use xlinkHref={`${sprite}#icon-calendar`}></use>
              </svg>
              <Moment format="MM//DD/YYYY" className="padding-small">
                {date}
              </Moment>
            </div>
          </div>
          <div className="group-container__header--bio-item">
            <div className="group-container__header--admins">
              <div className="bold">{admins.length} </div>
              <div className="padding-small">Admins</div>
            </div>
            <div className="group-container__header--members">
              <div className="bold">{members.length} </div>
              <div className="padding-small">Members</div>
            </div>
            <div className="group-container__header--posts">
              <div className="bold">{posts.length} </div>
              <div className="padding-small"> Posts</div>
            </div>
          </div>
        </div>
        {/* ------------------------------------- */}
      </div>
    </div>
  );
};

GroupHeader.propTypes = {
  group: PropTypes.object.isRequired,
  joinGroupById: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { joinGroupById })(GroupHeader);
