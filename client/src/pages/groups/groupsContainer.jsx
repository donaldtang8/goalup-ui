import { connect } from "react-redux";
import { compose } from "redux";

import WithSpinner from "../../components/with-spinner/with-spinner";

import Groups from "./groups";

const mapStateToProps = state => ({
  loading: state.groups.loading
});

const GroupsContainer = compose(connect(mapStateToProps), WithSpinner)(Groups);

export default GroupsContainer;
