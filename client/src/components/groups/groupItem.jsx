import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Moment from "react-moment";

import { joinGroupById } from "../../redux/actions/groups";
import PropTypes from "prop-types";

const GroupItem = ({
  auth,
  joinGroupById,
  group: { _id, name, description, date, creator, admins, members, posts },
  groups
}) => (
  <div className="groupItem">
    <div className="groupItem__header">
      <Link to={`/groups/${_id}`}>
        <div className="groupItem__header--avatar">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="groupItem__header--img"
          />
        </div>
        <div className="groupItem__header--name">{name}</div>
        <div className="groupItem__header--username">{`Creator: ${creator.name}`}</div>
      </Link>
    </div>
    <div className="groupItem__main">
      <div className="groupItem__details">
        <div className="groupItem__details--item">
          Members: {members.length}
        </div>
        <div className="groupItem__details--item">Posts: {posts.length}</div>
      </div>
      <div className="groupItem__body">
        <div className="groupItem__body--item">Description: {description}</div>
        <div className="groupItem__body--item">
          Created: <Moment format="MM/DD/YYYY">{date}</Moment>
        </div>
      </div>
      <div className="groupItem__actions">
        {auth.isAuthenticated &&
        auth.loading === false &&
        creator._id === auth.user._id ? (
          <Link to={`/group/${_id}/edit-group`}>
            <div className="btn-small btn-small--grey-dark">Edit Group</div>
          </Link>
        ) : (
          <div
            className={
              members.find(member => member.user === auth.user._id)
                ? "btn-small btn-small--primary"
                : "btn-small btn-small--primary"
            }
            onClick={() => joinGroupById(_id)}
          >
            {members.find(member => member.user === auth.user._id)
              ? "Leave"
              : "Join"}
          </div>
        )}
      </div>
    </div>
  </div>
);

GroupItem.propTypes = {
  group: PropTypes.object.isRequired,
  joinGroupById: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  groups: state.groups
});

export default connect(mapStateToProps, { joinGroupById })(GroupItem);
