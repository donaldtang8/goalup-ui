import { connect } from "react-redux";
import { compose } from "redux";

import WithSpinner from "../../components/with-spinner/with-spinner";

import Profiles from "./profiles";

const mapStateToProps = state => ({
  loading: state.profiles.loading
});

const ProfilesContainer = compose(
  connect(mapStateToProps),
  WithSpinner
)(Profiles);

export default ProfilesContainer;
