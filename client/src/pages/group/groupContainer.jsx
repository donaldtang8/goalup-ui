import { connect } from "react-redux";
import { compose } from "redux";

import WithSpinner from "../../components/with-spinner/with-spinner";

import Group from "./group";

const mapStateToProps = state => ({
  loading: state.groups.loading
});

const GroupContainer = compose(connect(mapStateToProps), WithSpinner)(Group);

export default GroupContainer;
