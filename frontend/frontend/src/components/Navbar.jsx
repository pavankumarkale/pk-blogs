import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser, logout } from "../services/auth";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

function Navbar() {
  const user = getUser();
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const [notificationCount, setNotificationCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");

      const unread = data.filter(
        (notification) => !notification.isRead
      );

      setNotificationCount(unread.length);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow sticky-top">

      <div className="container">

        {/* Logo */}

        <Link
          className="navbar-brand fw-bold fs-3 text-info"
          to="/"
        >
          PK BLOGS
        </Link>

        {/* Mobile Toggle */}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Items */}

        <div
          className="collapse navbar-collapse"
          id="navbarContent"
        >

          <ul className="navbar-nav ms-auto align-items-lg-center">

            {/* Home */}

            <li className="nav-item">
              <Link className="nav-link px-3" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
  <Link
    className="nav-link"
    to="/about"
  >
    About
  </Link>
</li>

            {/* Contact */}

            <li className="nav-item">
              <Link className="nav-link px-3" to="/contact">
                Contact
              </Link>
            </li>

            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/login">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link px-3" to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* Create Post */}

                <li className="nav-item">
                  <Link
                    className="nav-link px-3"
                    to="/create-post"
                  >
                    Create Post
                  </Link>
                </li>

                {/* My Posts */}

                <li className="nav-item">
                  <Link
                    className="nav-link px-3"
                    to="/my-posts"
                  >
                    My Posts
                  </Link>
                </li>

                {/* Profile */}

                <li className="nav-item">
                  <Link
                    className="nav-link px-3"
                    to="/profile"
                  >
                    Profile
                  </Link>
                </li>

                {/* Admin */}

                {user.role === "admin" && (
                  <li className="nav-item">
                    <Link
                      className="nav-link text-warning fw-bold px-3"
                      to="/admin"
                    >
                      Admin
                    </Link>
                  </li>
                )}

                {/* Notifications */}

                <li className="nav-item px-2">

                  <Link
                    to="/notifications"
                    className="nav-link position-relative fs-5"
                  >

                    🔔

                    {notificationCount > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      >
                        {notificationCount}
                      </span>
                    )}

                  </Link>

                </li>

                {/* Profile Image */}

                <li className="nav-item px-2">

                  {user.profileImage ? (
                    <img
                      src={`http://localhost:5000${user.profileImage}`}
                      alt="Profile"
                      className="rounded-circle shadow"
                      style={{
                        width: "45px",
                        height: "45px",
                        objectFit: "cover",
                        border: "2px solid white",
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center shadow"
                      style={{
                        width: "45px",
                        height: "45px",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}

                </li>

                {/* Username */}

                <li className="nav-item px-2">
                  <span className="text-white fw-semibold">
                    {user.name}
                  </span>
                </li>

                {/* Logout */}

                <li className="nav-item">
                  <button
                    className="btn btn-danger rounded-pill px-3 ms-lg-3 mt-2 mt-lg-0"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>

                <li className="nav-item me-2">

  <button
    className="btn btn-outline-light rounded-pill"
    onClick={toggleTheme}
  >

    {darkMode ? "☀️ Light" : "🌙 Dark"}

  </button>

</li>

              </>
            )}

          </ul>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;