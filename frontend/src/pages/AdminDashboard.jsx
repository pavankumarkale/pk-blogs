import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

import {
  Bar,
  Pie,
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(

  CategoryScale,

  LinearScale,

  BarElement,

  ArcElement,

  Tooltip,

  Legend

);

function AdminDashboard() {

  // ==============================
  // Current Logged-in Admin
  // ==============================

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // ==============================
  // Dashboard Statistics
  // ==============================

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0,
    totalCategories: 0,
     mostPopularCategory: "",
     mostPopularCategoryCount: 0,

     mostLikedPost: "",
  mostLikedPostLikes: 0,
  recentPosts: [],
  latestUsers: [],
  registrationByMonth: {},
  });

  // ==============================
  // Users & Posts
  // ==============================

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  // ==============================
  // Search
  // ==============================

  const [userSearch, setUserSearch] =
    useState("");

  const [postSearch, setPostSearch] =
    useState("");

  // ==============================
  // Loading
  // ==============================

  const [loading, setLoading] =
    useState(true);

  // ==============================
  // Load Dashboard Data
  // ==============================

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard = async () => {

    try {

      // Dashboard Statistics
      const statsResponse =
        await api.get(
          "/admin/dashboard"
        );

      setStats(statsResponse.data);

      // Users
      const userResponse =
        await api.get(
          "/admin/users"
        );

      setUsers(userResponse.data);

      // Posts
      const postResponse =
        await api.get(
          "/admin/posts"
        );

      setPosts(postResponse.data);

    } catch (error) {

      console.log(error);

      alert(
        "Failed to load Admin Dashboard."
      );

    } finally {

      setLoading(false);

    }

  };

  // ==============================
  // Delete User
  // ==============================

  const handleDeleteUser = async (
    userId
  ) => {

    if (
      userId === currentUser?._id
    ) {

      alert(
        "You cannot delete your own account."
      );

      return;

    }

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmDelete) return;

    try {

      await api.delete(
        `/admin/users/${userId}`
      );

      alert(
        "User deleted successfully."
      );

      setUsers((prevUsers) =>
        prevUsers.filter(
          (u) => u._id !== userId
        )
      );

      setStats((prev) => ({
        ...prev,
        totalUsers:
          prev.totalUsers - 1,
      }));

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Failed to delete user."
      );

    }

  };

  // ==============================
  // Delete Post
  // ==============================

  const handleDeletePost = async (
    postId
  ) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this post?"
      );

    if (!confirmDelete) return;

    try {

      await api.delete(
        `/admin/posts/${postId}`
      );

      alert(
        "Post deleted successfully."
      );

      setPosts((prevPosts) =>
        prevPosts.filter(
          (post) =>
            post._id !== postId
        )
      );

      setStats((prev) => ({
        ...prev,
        totalPosts:
          prev.totalPosts - 1,
      }));

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Failed to delete post."
      );

    }

  };

  // ==============================
  // Filter Users
  // ==============================

  const filteredUsers =
    users.filter((u) => {

      const search =
        userSearch
          .trim()
          .toLowerCase();

      return (

        u.name
          ?.toLowerCase()
          .includes(search) ||

        u.email
          ?.toLowerCase()
          .includes(search)

      );

    });

  // ==============================
  // Filter Posts
  // ==============================

  const filteredPosts =
    posts.filter((post) => {

      const search =
        postSearch
          .trim()
          .toLowerCase();

      return (

        post.title
          ?.toLowerCase()
          .includes(search) ||

        post.category
          ?.toLowerCase()
          .includes(search) ||

        post.author?.name
          ?.toLowerCase()
          .includes(search)

      );

    });

    // =============================
// Posts Per Category Chart
// =============================

const categoryCount = {};

posts.forEach((post) => {

  if (categoryCount[post.category]) {

    categoryCount[post.category]++;

  } else {

    categoryCount[post.category] = 1;

  }

});

const categoryChartData = {

  labels: Object.keys(categoryCount),

  datasets: [

    {

      label: "Posts",

      data: Object.values(categoryCount),

      borderWidth: 1,

    },

  ],

};

// =============================
// Likes Distribution Pie Chart
// =============================

const likesChartData = {

  labels: posts.map((post) => post.title),

  datasets: [

    {

      label: "Likes",

      data: posts.map(

        (post) => post.likes.length

      ),

      borderWidth: 1,

    },

  ],

};

// =============================
// User Registration Chart
// =============================

const registrationChartData = {

  labels: Object.keys(
    stats.registrationByMonth || {}
  ),

  datasets: [

    {

      label: "Users",

      data: Object.values(
        stats.registrationByMonth || {}
      ),

      borderWidth: 1,

    },

  ],

};

  // ==============================
  // Loading Screen
  // ==============================

  if (loading) {

    return (

      <div className="container mt-5 text-center">

        <div className="spinner-border text-primary"></div>

        <h5 className="mt-3">

          Loading Dashboard...

        </h5>

      </div>

    );

  }

  // ==============================
  // Protect Admin Route
  // ==============================

  if (
    !currentUser ||
    currentUser.role !== "admin"
  ) {

    return <Navigate to="/" replace />;

  }

  return (

    <div className="container mt-5">

  {/* ==============================
      Dashboard Title
  ============================== */}

  <h1 className="text-center fw-bold mb-5">

    👑 Admin Dashboard

  </h1>

  {/* ==============================
      Dashboard Statistics
  ============================== */}

 {/* ======================================
    Dashboard Statistics
====================================== */}

<div className="row g-4 mb-5">

  {/* Users */}

  <div className="col-xl-2 col-lg-4 col-md-6">

    <div className="card dashboard-card border-0 shadow h-100">

      <div className="card-body text-center">

        <div className="display-5 mb-3">
          👥
        </div>

        <h2 className="fw-bold text-primary">
          {stats.totalUsers}
        </h2>

        <p className="text-muted mb-0">
          Total Users
        </p>

      </div>

    </div>

  </div>

  {/* Posts */}

  <div className="col-xl-2 col-lg-4 col-md-6">

    <div className="card dashboard-card border-0 shadow h-100">

      <div className="card-body text-center">

        <div className="display-5 mb-3">
          📝
        </div>

        <h2 className="fw-bold text-success">
          {stats.totalPosts}
        </h2>

        <p className="text-muted mb-0">
          Total Posts
        </p>

      </div>

    </div>

  </div>

  {/* Comments */}

  <div className="col-xl-2 col-lg-4 col-md-6">

    <div className="card dashboard-card border-0 shadow h-100">

      <div className="card-body text-center">

        <div className="display-5 mb-3">
          💬
        </div>

        <h2 className="fw-bold text-danger">
          {stats.totalComments}
        </h2>

        <p className="text-muted mb-0">
          Comments
        </p>

      </div>

    </div>

  </div>

  {/* Likes */}

  <div className="col-xl-3 col-lg-6 col-md-6">

    <div className="card dashboard-card border-0 shadow h-100">

      <div className="card-body text-center">

        <div className="display-5 mb-3">
          ❤️
        </div>

        <h2 className="fw-bold text-danger">
          {stats.totalLikes}
        </h2>

        <p className="text-muted mb-0">
          Total Likes
        </p>

      </div>

    </div>

  </div>

  {/* Categories */}

  <div className="col-xl-3 col-lg-6 col-md-6">

    <div className="card dashboard-card border-0 shadow h-100">

      <div className="card-body text-center">

        <div className="display-5 mb-3">
          📂
        </div>

        <h2 className="fw-bold text-warning">
          {stats.totalCategories}
        </h2>

        <p className="text-muted mb-0">
          Categories
        </p>

      </div>

    </div>

  </div>

</div>

{/* ======================================
    Analytics Cards
====================================== */}

<div className="row g-4 mb-5">

  {/* Top Category */}

  <div className="col-lg-6">

    <div className="card dashboard-card border-0 shadow h-100">

      <div className="card-body text-center py-5">

        <div className="display-4 mb-3">
          🏆
        </div>

        <h3 className="fw-bold">
          {stats.mostPopularCategory || "No Category"}
        </h3>

        <p className="text-muted">
          Most Popular Category
        </p>

        <span className="badge bg-success px-3 py-2 fs-6">

          {stats.mostPopularCategoryCount} Posts

        </span>

      </div>

    </div>

  </div>

  {/* Most Liked */}

  <div className="col-lg-6">

    <div className="card dashboard-card border-0 shadow h-100">

      <div className="card-body text-center py-5">

        <div className="display-4 mb-3">
          🔥
        </div>

        <h3 className="fw-bold">
          {stats.mostLikedPost || "No Posts"}
        </h3>

        <p className="text-muted">
          Most Liked Blog
        </p>

        <span className="badge bg-danger px-3 py-2 fs-6">

          ❤️ {stats.mostLikedPostLikes} Likes

        </span>

      </div>

    </div>

  </div>

</div>

  {/* ==============================
      Manage Users
  ============================== */}

  <hr className="my-5" />

  <div className="d-flex justify-content-between align-items-center mb-3">

    <h2 className="fw-bold">

      👥 Manage Users

    </h2>

    <span className="badge bg-primary fs-6">

      {filteredUsers.length} Users

    </span>

  </div>

  {/* User Search */}

  <div className="mb-4">

    <input
      type="text"
      className="form-control shadow-sm"
      placeholder="🔍 Search users by name or email..."
      value={userSearch}
      onChange={(e) =>
        setUserSearch(e.target.value)
      }
    />

  </div>

  {/* Users Table */}

  <div className="table-responsive">

    <table className="table table-striped table-hover align-middle">

      <thead className="table-dark">

        <tr>

          <th>Name</th>

          <th>Email</th>

          <th>Role</th>

          <th>Joined</th>

          <th width="160">

            Action

          </th>

        </tr>

      </thead>

      <tbody>

        {filteredUsers.length === 0 ? (

          <tr>

            <td
              colSpan="5"
              className="text-center text-muted py-4"
            >

              🚫 No users found.

            </td>

          </tr>

        ) : (

          filteredUsers.map((u) => (

            <tr key={u._id}>

              <td>

                <strong>

                  {u.name}

                </strong>

              </td>

              <td>

                {u.email}

              </td>

              <td>

                {u.role === "admin" ? (

                  <span className="badge bg-danger">

                    Admin

                  </span>

                ) : (

                  <span className="badge bg-success">

                    User

                  </span>

                )}

              </td>

              <td>

                {new Date(
                  u.createdAt
                ).toLocaleDateString()}

              </td>

              <td>

                {u._id === currentUser._id ? (

                  <button
                    className="btn btn-secondary btn-sm w-100"
                    disabled
                  >

                    Current User

                  </button>

                ) : (

                  <button
                    className="btn btn-outline-danger btn-sm w-100"
                    onClick={() =>
                      handleDeleteUser(u._id)
                    }
                  >

                    🗑 Delete

                  </button>

                )}

              </td>

            </tr>

          ))

        )}

      </tbody>

    </table>

  </div>

  {/* ==============================
      Manage Posts starts here
  ============================== */}
    <hr className="my-5" />

  <div className="d-flex justify-content-between align-items-center mb-3">

    <h2 className="fw-bold">

      📝 Manage Posts

    </h2>

    <span className="badge bg-success fs-6">

      {filteredPosts.length} Posts

    </span>

  </div>

  {/* Search Posts */}

  <div className="mb-4">

    <input
      type="text"
      className="form-control shadow-sm"
      placeholder="🔍 Search posts by title, category or author..."
      value={postSearch}
      onChange={(e) =>
        setPostSearch(e.target.value)
      }
    />

  </div>

  {/* Posts Table */}

  <div className="table-responsive">

    <table className="table table-striped table-hover align-middle">

      <thead className="table-dark">

        <tr>

          <th>Title</th>

          <th>Author</th>

          <th>Category</th>

          <th>Created</th>

          <th width="160">

            Action

          </th>

        </tr>

      </thead>

      <tbody>

        {filteredPosts.length === 0 ? (

          <tr>

            <td
              colSpan="5"
              className="text-center text-muted py-4"
            >

              📝 No posts found.

            </td>

          </tr>

        ) : (

          filteredPosts.map((post) => (

            <tr key={post._id}>

              <td>

                <strong>

                  {post.title}

                </strong>

              </td>

              <td>

                {post.author?.name || "Unknown"}

              </td>

              <td>

                <span className="badge bg-primary">

                  {post.category || "General"}

                </span>

              </td>

              <td>

                {new Date(
                  post.createdAt
                ).toLocaleDateString()}

              </td>

              <td>

                <button
                  className="btn btn-outline-danger btn-sm w-100"
                  onClick={() =>
                    handleDeletePost(post._id)
                  }
                >

                  🗑 Delete

                </button>

              </td>

            </tr>

          ))

        )}

      </tbody>

    </table>

  </div>

  <hr className="my-5" />

<h2 className="mb-4">
  📝 Recent Posts
</h2>

<div className="table-responsive">

  <table className="table table-bordered table-hover">

    <thead className="table-dark">

      <tr>

        <th>Title</th>

        <th>Author</th>

        <th>Date</th>

      </tr>

    </thead>

    <tbody>

      {stats.recentPosts.length === 0 ? (

        <tr>

          <td
            colSpan="3"
            className="text-center"
          >

            No Recent Posts

          </td>

        </tr>

      ) : (

        stats.recentPosts.map((post) => (

          <tr key={post._id}>

            <td>{post.title}</td>

            <td>{post.author?.name}</td>

            <td>
              {new Date(
                post.createdAt
              ).toLocaleDateString()}
            </td>

          </tr>

        ))

      )}

    </tbody>

  </table>

</div>

<hr className="my-5" />

<h2 className="mb-4">
  👥 Latest Registered Users
</h2>

<div className="table-responsive">

  <table className="table table-bordered table-hover">

    <thead className="table-dark">

      <tr>

        <th>Name</th>

        <th>Email</th>

        <th>Joined</th>

      </tr>

    </thead>

    <tbody>

      {stats.latestUsers.length === 0 ? (

        <tr>

          <td
            colSpan="3"
            className="text-center"
          >

            No Users Found

          </td>

        </tr>

      ) : (

        stats.latestUsers.map((user) => (

          <tr key={user._id}>

            <td>{user.name}</td>

            <td>{user.email}</td>

            <td>
              {new Date(
                user.createdAt
              ).toLocaleDateString()}
            </td>

          </tr>

        ))

      )}

    </tbody>

  </table>

</div>

<hr className="my-5" />

<h2 className="mb-4">

📊 Posts By Category

</h2>

<div className="card shadow p-4">

  <Bar data={categoryChartData} />

</div>

<hr className="my-5" />

<h2 className="mb-4">

❤️ Likes Distribution

</h2>

<div className="card shadow p-4">

  <Pie data={likesChartData} />

</div>

<hr className="my-5" />

<h2 className="mb-4">

👥 User Registrations

</h2>

<div className="card shadow p-4">

  <Bar data={registrationChartData} />

</div>

  {/* Footer */}

  <hr className="my-5" />

  <div className="text-center text-muted mb-4">

    <small>

      MERN Blog Admin Dashboard © 2026

    </small>

  </div>

</div>

);

}

export default AdminDashboard;