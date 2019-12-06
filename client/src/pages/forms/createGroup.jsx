import React from "react";

import CreateGroupForm from "../../components/forms/createGroup";

const CreateGroup = () => {
  return (
    <div className="group-forms-container">
      <div className="u-center-text u-margin-bottom-medium">
        <div className="heading-secondary">Create a Group</div>
      </div>
      <CreateGroupForm />
    </div>
  );
};

export default CreateGroup;
