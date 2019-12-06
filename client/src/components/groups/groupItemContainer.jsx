import { connect } from "react-redux";
import { compose } from "redux";

import WithSpinner from "../with-spinner/with-spinner";

import GroupItem from "./groupItem";

const mapStateToProps = state => ({
  loading: state.groups.loading
});

const GroupItemContainer = compose(
  connect(mapStateToProps),
  WithSpinner
)(GroupItem);

export default GroupItemContainer;
