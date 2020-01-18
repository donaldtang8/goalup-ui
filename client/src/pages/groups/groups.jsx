import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getGroups, getJoinedGroups } from "../../redux/actions/groups";
import PropTypes from "prop-types";

import GroupItem from "../../components/groups/groupItem";

const Groups = ({ getGroups, getJoinedGroups, groups: { groups } }) => {
  useEffect(() => {
    getGroups();
    getJoinedGroups();
  }, [getGroups]);

  return (
    <div className="groups-container">
      <Link to="/group/create-group" className="btn-small btn--primary">
        Create Group
      </Link>
      <div className="groupsItems-container">
        {groups.map(group => (
          <GroupItem key={group._id} group={group} />
        ))}
      </div>
    </div>
  );
};

Groups.propTypes = {
  getGroups: PropTypes.func.isRequired,
  getJoinedGroups: PropTypes.func.isRequired,
  groups: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  groups: state.groups
});

export default connect(mapStateToProps, { getGroups, getJoinedGroups })(Groups);
