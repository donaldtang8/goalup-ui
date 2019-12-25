import React from "react";

const Notification = ({ details }) => {
  <div className="notification">
    <div className="notification__image"></div>
    <div className="notification__main">
      <div className="notification__header"></div>
      <div className="notification__body"></div>
    </div>
  </div>;
};

Notification.propTypes = {
  details: PropTypes.object.isRequired
};

export default Notification;
