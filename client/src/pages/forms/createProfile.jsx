import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import CreateProfileForm from "../../components/forms/createProfile";

const CreateProfile = ({ auth }) => {
  console.log("hi");
  if (auth.loading === false && auth.hasProfile === true) {
    return <Redirect to="/" />;
  }
  return (
    <div className="forms-container">
      <div className="u-center-text u-margin-bottom-medium">
        <div className="heading-secondary">Get started with goal up</div>
      </div>
      <CreateProfileForm />
    </div>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, null)(CreateProfile);
