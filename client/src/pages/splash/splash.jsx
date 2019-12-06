import React from "react";
import { Redirect, withRouter } from "react-router-dom";

import { connect } from "react-redux";

import SignUp from "../../components/signUp/signUp";
import PropTypes from "prop-types";

const Splash = ({
  auth: { isAuthenticated, hasProfile, loading },
  history
}) => {
  if (!loading && isAuthenticated && !hasProfile) {
    return <Redirect to="/create-profile" />;
  }
  if (!loading && isAuthenticated) {
    return <Redirect to="/posts" />;
  }

  return (
    <div className="splash-container">
      <div className="splash-container__desc">
        <div className="bg-video">
          <video className="bg-video__content" autoPlay muted loop>
            <source
              src="https://assets.mixkit.co/videos/1170/1170-720.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <div className="heading-primary heading-primary--sub">Goal Up!</div>
      </div>
      <div className="splash-container__signup">
        <div className="splash-container__signup__form">
          <SignUp history={history} />
        </div>
      </div>
    </div>
  );
};

Splash.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, null)(withRouter(Splash));
