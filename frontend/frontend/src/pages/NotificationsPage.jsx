import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function NotificationsPage() {

  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchNotifications();

  }, []);

  const fetchNotifications = async () => {

    try {

      const { data } =
        await api.get("/notifications");

      setNotifications(data);

    } catch (error) {

      console.log(error);

      alert("Failed to load notifications.");

    } finally {

      setLoading(false);

    }

  };


const handleMarkAsRead = async (
  id,
  postId
) => {

  try {

    await api.put(
      `/notifications/${id}/read`
    );

    setNotifications((prev) =>
      prev.map((notification) =>
        notification._id === id
          ? {
              ...notification,
              isRead: true,
            }
          : notification
      )
    );

    navigate(`/post/${postId}`);

  } catch (error) {

    console.log(error);

    alert(
      "Failed to update notification."
    );

  }

};

const handleDelete = async (id) => {

  const confirmDelete = window.confirm(
    "Delete this notification?"
  );

  if (!confirmDelete) return;

  try {

    await api.delete(
      `/notifications/${id}`
    );

    setNotifications((prev) =>
      prev.filter(
        (notification) =>
          notification._id !== id
      )
    );

  } catch (error) {

    console.log(error);

    alert("Failed to delete notification.");

  }

};

const handleClearAll = async () => {

  const confirmClear = window.confirm(
    "Clear all notifications?"
  );

  if (!confirmClear) return;

  try {

    await api.delete("/notifications");

    setNotifications([]);

  } catch (error) {

    console.log(error);

    alert("Failed to clear notifications.");

  }

};
    if (loading) {

    return (

      <div className="container mt-5">

        <h3>Loading Notifications...</h3>

      </div>

    );

  }

    if (notifications.length === 0) {

    return (

      <div className="container mt-5">

        <h2 className="text-center">

          🔔 Notifications

        </h2>

        <p className="text-center mt-4">

          No notifications yet.

        </p>

      </div>

    );

  }

    return (

    <div className="container mt-5">

      <div className="d-flex justify-content-between align-items-center mb-4">

  <h2>🔔 Notifications</h2>

  {notifications.length > 0 && (

    <button
      className="btn btn-danger"
      onClick={handleClearAll}
    >
      🧹 Clear All
    </button>

  )}

</div>

      {notifications.map((notification) => (

        <div
  key={notification._id}
  className={`card mb-3 shadow ${
    notification.isRead
      ? ""
      : "border-primary"
  }`}
  style={{
    cursor: "pointer",
  }}
 onClick={() =>
  handleMarkAsRead(
    notification._id,
    notification.post?._id
  )
}
>

          <div className="card-body">

            <h5>

              {notification.type === "like"
                ? "❤️ Like"
                : "💬 Comment"}

            </h5>

            <p>

              {notification.message}

            </p>

            <small className="text-muted">

              From: {notification.sender?.name}

            </small>

            <br />

            <small className="text-muted">

              {new Date(
                notification.createdAt
              ).toLocaleString()}

            </small>

            <div className="mt-3">

  <button
    className="btn btn-outline-danger btn-sm"
    onClick={(e) => {

      e.stopPropagation();

      handleDelete(
        notification._id
      );

    }}
  >
    🗑 Delete
  </button>

</div>

          </div>

        </div>

      ))}

    </div>

  );

}

export default NotificationsPage;