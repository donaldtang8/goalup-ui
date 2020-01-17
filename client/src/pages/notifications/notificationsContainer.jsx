import { connect } from "react-redux";
import { compose } from "redux";

import WithSpinner from "../../components/with-spinner/with-spinner";

import Notifications from "./notifications";

const mapStateToProps = state => ({
  loading: state.auth.loading
});

const NotificationsContainer = compose(
  connect(mapStateToProps),
  WithSpinner
)(Notifications);

export default NotificationsContainer;
