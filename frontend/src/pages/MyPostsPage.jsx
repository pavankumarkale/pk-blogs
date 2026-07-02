import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

function MyPostsPage() {

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [loadingLikeId, setLoadingLikeId] =
    useState(null);

  useEffect(() => {

    const fetchMyPosts = async () => {

      try {

        const { data } =
          await api.get("/posts/my-posts");

        setPosts(data);

      } catch (error) {

        console.log(error);
        toast.error(
          error.response?.data?.message ||
          "Failed to fetch my posts"
        );
      } finally {

        setLoading(false);

      }

    };

    fetchMyPosts();

  }, []);

  // Delete Blog

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(`/posts/${id}`);

      toast.success("Post deleted successfully.");

      setPosts((prevPosts) =>
        prevPosts.filter(
          (post) => post._id !== id
        )
      );

    } catch (error) {

      console.log(error);

     toast.error(
  error.response?.data?.message ||
  "Delete Failed"
);

    }

  };

  // Like / Unlike

  const handleLike = async (postId) => {

    if (loadingLikeId) return;

    setLoadingLikeId(postId);

    try {

      await api.put(`/posts/${postId}/like`);

      const { data } =
        await api.get("/posts/my-posts");

      setPosts(data);

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to update like."
      );

    } finally {

      setLoadingLikeId(null);

    }

  };

  // Search by Title + Category

  const filteredPosts = posts.filter(
    (post) => {

      const searchText =
        search.toLowerCase();

      return (

        post.title
          .toLowerCase()
          .includes(searchText)

        ||

        post.category
          .toLowerCase()
          .includes(searchText)

      );

    }
  );

  if (loading) {

    return (

      <div className="container mt-5">

        <h3>Loading...</h3>

      </div>

    );

  }

  return (

    <div className="container mt-5">

  <h2 className="text-center mb-3">

    My Dashboard

  </h2>

  <p className="text-center text-muted mb-4">

    Total Posts : <strong>{filteredPosts.length}</strong>

  </p>

  {/* Search */}

  <div className="row justify-content-center mb-4">

    <div className="col-md-6">

      <input
        type="text"
        className="form-control shadow"
        placeholder="🔍 Search My Posts..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

    </div>

  </div>

  {filteredPosts.length === 0 ? (

    <h4 className="text-center">

      No matching posts found.

    </h4>

  ) : (

    <div className="row">

      {filteredPosts.map((post) => (

        <div
          className="col-lg-4 col-md-6 mb-4"
          key={post._id}
        >

          <div className="card h-100 shadow">

            {post.image && (

              <img
                src={`http://localhost:5000${post.image}`}
                className="card-img-top"
                style={{
                  height: "220px",
                  objectFit: "cover",
                }}
                alt={post.title}
              />

            )}

            <div className="card-body">

              <h4 className="card-title">

                {post.title}

              </h4>

              <span className="badge bg-success mb-2">

                {post.category}

              </span>

              <p className="text-muted mt-2">

                📅 Published on{" "}

                {new Date(
                  post.createdAt
                ).toLocaleDateString()}

              </p>

              <p>

                {post.content.length > 80
                  ? post.content.substring(0, 80) +
                    "..."
                  : post.content}

              </p>

            </div>

            <div className="card-footer">

              <div className="d-flex justify-content-between align-items-center">

                <span className="badge bg-danger">

                  ❤️ {post.likes?.length || 0}

                </span>

              </div>

              <button
                className={
                  post.likes?.some(
                    (id) =>
                      String(id) ===
                      String(currentUser?._id)
                  )
                    ? "btn btn-danger w-100 mt-3"
                    : "btn btn-outline-danger w-100 mt-3"
                }
                onClick={() =>
                  handleLike(post._id)
                }
                disabled={
                  loadingLikeId === post._id
                }
              >

                {loadingLikeId === post._id
                  ? "Updating..."
                  : post.likes?.some(
                      (id) =>
                        String(id) ===
                        String(currentUser?._id)
                    )
                  ? "❤️ Unlike"
                  : "🤍 Like"}

              </button>

              <div className="d-flex justify-content-between mt-3">

                <Link
                  to={`/post/${post._id}`}
                  className="btn btn-primary"
                >
                  View
                </Link>

                <button
                  className="btn btn-warning"
                  onClick={() =>
                    navigate(
                      `/edit-post/${post._id}`
                    )
                  }
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() =>
                    handleDelete(post._id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        </div>

      ))}

    </div>

  )}

      </div>

  );

}

export default MyPostsPage;