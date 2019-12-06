import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { getGroupById, joinGroupById } from "../../redux/actions/groups";

import PostForm from "../../components/posts/postForm";
import GroupHeader from "../../components/group/groupHeader";
import GroupBody from "../../components/group/groupBody";

import PropTypes from "prop-types";

const Group = ({
  getGroupById,
  joinGroupById,
  auth,
  match,
  history,
  groups: { group, loading, error }
}) => {
  useEffect(() => {
    getGroupById(match.params.id);
  }, [getGroupById, match.params.id]);

  return (
    <div className="group-container">
      {group === null && error ? (
        <div>Group not found</div>
      ) : (
        <Fragment>
          <GroupHeader group={group} />
          {group.members.find(member => member.user._id === auth.user._id) ? (
            <Fragment>
              <PostForm medium="group" group={group} />
              <GroupBody group={group} />
            </Fragment>
          ) : (
            <div className="group-container--error">
              Please join to create and view posts
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
};

Group.propTypes = {
  getGroupById: PropTypes.func.isRequired,
  joinGroupById: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  groups: state.groups
});

export default connect(mapStateToProps, { getGroupById, joinGroupById })(Group);
