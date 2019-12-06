import React, { useEffect } from "react";
import { connect } from "react-redux";

import { getProfiles } from "../../redux/actions/profiles";
import PropTypes from "prop-types";

import ProfileItem from "../../components/profiles/profileItem";

const Profiles = ({ getProfiles, profiles: { profiles, loading } }) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  return (
    <div className="profiles-container">
      <div className="profilesItems-container">
        {profiles.length > 0 ? (
          profiles.map(profile => (
            <ProfileItem key={profile._id} profile={profile} />
          ))
        ) : (
          <div className="h4">No profiles found...</div>
        )}
      </div>
    </div>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profiles: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profiles: state.profiles
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
