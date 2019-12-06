import { connect } from "react-redux";
import { compose } from "redux";

import WithSpinner from "../../components/with-spinner/with-spinner";

import Posts from "./posts";

const mapStateToProps = state => ({
  loading: state.profiles.loading
});

const PostsContainer = compose(connect(mapStateToProps), WithSpinner)(Posts);

export default PostsContainer;
