import React from "react";

import EditGroupForm from "../../components/forms/editGroup";

const EditGroup = () => {
  return (
    <div className="group-forms-container">
      <div className="u-center-text u-margin-bottom-medium">
        <div className="heading-secondary">Edit Group</div>
      </div>
      <EditGroupForm />
    </div>
  );
};

export default EditGroup;
