import { connect } from "react-redux";
import { compose } from "redux";

import WithSpinner from "../../components/with-spinner/with-spinner";

import Friends from "./friends";

const mapStateToProps = state => ({
  auth: state.auth.loading
});

const FriendsContainer = compose(
  connect(mapStateToProps),
  WithSpinner
)(Friends);

export default FriendsContainer;
