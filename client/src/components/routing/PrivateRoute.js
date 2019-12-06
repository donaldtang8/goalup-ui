import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// we will pass in the private components and check if the user is authenticated and page is done loading
// if not, then redirect to login
// else, redirect to component with props
// ...rest will grab rest of props

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, hasProfile, loading },
  ...rest
}) => {
  return !isAuthenticated && !loading ? (
    <Route {...rest} render={props => <Redirect to="/" />} />
  ) : (
    !loading && (
      <Route
        {...rest}
        render={props =>
          hasProfile === true ? (
            <Component {...props} />
          ) : (
            <Redirect to="/create-profile" />
          )
        }
      />
    )
  );
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
