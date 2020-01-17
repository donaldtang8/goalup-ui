import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { removeNotificationById } from "../../redux/actions/notifications";

import Moment from "react-moment";

const NotificationItem = ({
  removeNotificationById,
  notification: {
    _id,
    item_id,
    user_from,
    viewed,
    opened,
    action,
    message,
    date
  }
}) => {
  const removeNotification = (e, notifId) => {
    e.preventDefault();
    removeNotificationById(notifId);
  };

  return (
    <div className="notificationItem">
      <Link to={`/profiles/${user_from._id}`}>
        <div className="notificationItem__header">
          <div className="notificationItem__image">
            <img src={user_from.avatar} alt={user_from.name} />
          </div>
          <div className="notificationItem__name">{user_from.name}</div>
        </div>
      </Link>
      <div className="notificationItem__body">
        <div className="notificationItem__body--main">
          <div className="notificationItem__body--main-message">{message}</div>
          <div
            className="notificationItem__body--main-close"
            onClick={e => removeNotification(e, _id)}
          >
            <i className="fas fa-times"></i>
          </div>
        </div>
        <div className="notificationItem__body--time">
          <Moment fromNow>{date}</Moment>
        </div>
      </div>
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
  removeNotificationById: PropTypes.func.isRequired
};

export default connect(null, { removeNotificationById })(NotificationItem);
