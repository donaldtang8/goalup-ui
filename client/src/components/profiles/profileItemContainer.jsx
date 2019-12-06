import { connect } from "react-redux";
import { compose } from "redux";

import WithSpinner from "../../components/with-spinner/with-spinner";

import ProfileItem from "./profileItem";

const mapStateToProps = state => ({
  loading: state.profiles.loading
});

const ProfileItemContainer = compose(
  connect(mapStateToProps),
  WithSpinner
)(ProfileItem);

export default ProfileItemContainer;
