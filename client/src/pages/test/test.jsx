import React from "react";
import { connect } from "react-redux";

import { joinGroupById } from "../../redux/actions/groups";
import PropTypes from "prop-types";

const TestPage = ({ joinGroupById }) => (
  <div onClick={() => joinGroupById("5dcad4c0d393993fa01c0b8f")}>Test</div>
);

TestPage.propTypes = {
  group: PropTypes.object.isRequired,
  joinGroupById: PropTypes.func.isRequired
};

export default connect(null, { joinGroupById })(TestPage);
