import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import NotificationItem from "../../components/notifications/notificationItem";

import { getUserNotifications } from "../../redux/actions/notifications";

import Moment from "react-moment";

const Notifications = ({
  getUserNotifications,
  auth: { user },
  notifications: { notifications }
}) => {
  return (
    <div className="notifications-container">
      <div className="notificationsItems-container">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <NotificationItem
              key={notification._id}
              notification={notification}
            />
          ))
        ) : (
          <div className="paragraph center">No notifications found...</div>
        )}
      </div>
    </div>
  );
};

Notifications.propTypes = {
  getUserNotifications: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  notifications: state.notifications
});

export default connect(mapStateToProps, { getUserNotifications })(
  Notifications
);
