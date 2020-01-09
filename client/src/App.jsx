import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { connect } from "react-redux";
import { loadUser } from "../src/redux/actions/auth";

import setAuthToken from "../src/utils/setAuthToken";

import Header from "./components/header/header";
import Navigation from "./components/navigation/navigation";
import Spinner from "./components/spinner/spinner";
import PrivateRoute from "./components/routing/PrivateRoute";
import AuthRoute from "./components/routing/AuthRoute";

import "./App.css";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const Splash = lazy(() => import("./pages/splash/splash"));
const PostsPage = lazy(() => import("./pages/posts/postsContainer"));
const MembersPage = lazy(() => import("./pages/profiles/profilesContainer"));
const GroupsPage = lazy(() => import("./pages/groups/groupsContainer"));
const ProfilePage = lazy(() => import("./pages/profile/profileContainer"));
const GroupPage = lazy(() => import("./pages/group/groupContainer"));
const CreateProfilePage = lazy(() => import("./pages/forms/createProfile"));
const EditProfilePage = lazy(() => import("./pages/forms/editProfile"));
const CreateGroupPage = lazy(() => import("./pages/forms/createGroup"));
const EditGroupPage = lazy(() => import("./pages/forms/editGroup"));
const FriendsPage = lazy(() => import("./pages/friends/friendsContainer"));

const App = ({ loadUser, auth }) => {
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <div className="App">
      <div className="container">
        <Header />
        <Switch>
          <Suspense fallback={<Spinner />}>
            {auth.isAuthenticated && auth.hasProfile ? (
              <div className="content">
                <Navigation />
                <main className="main-view">
                  <Route exact path="/" component={Splash} />
                  <PrivateRoute exact path="/posts" component={PostsPage} />
                  <PrivateRoute
                    exact
                    path="/profiles"
                    component={MembersPage}
                  />
                  <PrivateRoute
                    exact
                    path="/profiles/:id"
                    component={ProfilePage}
                  />
                  <PrivateRoute
                    exact
                    path="/profile/:id/edit-profile"
                    component={EditProfilePage}
                  />
                  <PrivateRoute exact path="/groups" component={GroupsPage} />
                  <PrivateRoute
                    exact
                    path="/groups/:id"
                    component={GroupPage}
                  />
                  <PrivateRoute
                    exact
                    path="/group/create-group"
                    component={CreateGroupPage}
                  />
                  <PrivateRoute
                    exact
                    path="/group/:id/edit-group"
                    component={EditGroupPage}
                  />
                  <PrivateRoute exact path="/friends" component={FriendsPage} />
                </main>
              </div>
            ) : (
              <div className="content">
                <Route exact path="/" component={Splash} />
                <AuthRoute
                  exact
                  path="/create-profile"
                  component={CreateProfilePage}
                />
                {/* <Route render={() => <Redirect to="/" />} /> */}
              </div>
            )}
          </Suspense>
        </Switch>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { loadUser })(App);
