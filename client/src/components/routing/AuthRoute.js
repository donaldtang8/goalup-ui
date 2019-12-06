import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Spinner from "../../components/spinner/spinner";

// we will pass in the private components and check if the user is authenticated and page is done loading
// if not, then redirect to login
// else, redirect to component with props
// ...rest will grab rest of props
const AuthRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => {
  return !loading ? (
    <Route
      {...rest}
      render={props =>
        !isAuthenticated ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  ) : (
    <Spinner />
  );
};

AuthRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(AuthRoute);
