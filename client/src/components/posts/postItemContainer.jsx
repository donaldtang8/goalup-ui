import { connect } from "react-redux";
import { compose } from "redux";

import WithSpinner from "../with-spinner/with-spinner";

import PostItem from "./postItem";

const mapStateToProps = state => ({
  loading: state.posts.loading
});

const GroupItemContainer = compose(
  connect(mapStateToProps),
  WithSpinner
)(PostItem);

export default GroupItemContainer;
