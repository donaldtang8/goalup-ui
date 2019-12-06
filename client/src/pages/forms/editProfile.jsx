import React from "react";

import EditProfileForm from "../../components/forms/editProfile";

const EditProfile = () => {
  return (
    <div className="profile-forms-container">
      <div className="u-center-text u-margin-bottom-medium">
        <div className="heading-secondary">Edit Profile</div>
      </div>
      <EditProfileForm />
    </div>
  );
};

export default EditProfile;
