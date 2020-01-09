import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { getProfileById } from "../../redux/actions/profiles";

import ProfileHeader from "../../components/profile/profileHeader";
import ProfileBody from "../../components/profile/profileBody";

import PropTypes from "prop-types";

const Profile = ({
  getProfileById,
  auth,
  match,
  history,
  profiles: { profile, loading, error }
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);

  return (
    <div className="profile-container">
      {profile === null && error ? (
        <div>Profile not found</div>
      ) : (
        <Fragment>
          <ProfileHeader profile={profile} />
          <ProfileBody profile={profile} />
        </Fragment>
      )}
    </div>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profiles: state.profiles
});

export default connect(mapStateToProps, { getProfileById })(Profile);
