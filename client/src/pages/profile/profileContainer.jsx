import { connect } from "react-redux";
import { compose } from "redux";

import WithSpinner from "../../components/with-spinner/with-spinner";

import Profile from "./profile";

const mapStateToProps = state => ({
  loading: state.profiles.loading
});

const ProfileContainer = compose(
  connect(mapStateToProps),
  WithSpinner
)(Profile);

export default ProfileContainer;
