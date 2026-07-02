import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function PostDetailsPage() {

  const { id } = useParams();

  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [post, setPost] = useState(null);

  const [comments, setComments] = useState([]);

  const [newComment, setNewComment] =
    useState("");

  const [liked, setLiked] =
    useState(false);

  const [likeCount, setLikeCount] =
    useState(0);

  const [likeLoading, setLikeLoading] =
    useState(false);

  useEffect(() => {

    fetchPost();

  }, [id]);

  // Fetch Blog + Comments

  const fetchPost = async () => {

    try {

      const { data } =
        await api.get(`/posts/${id}`);

      setPost(data);

      setLikeCount(
        data.likes?.length || 0
      );

      if (
        currentUser &&
        data.likes
      ) {

        setLiked(

          data.likes.some(

            (userId) =>

              String(userId) ===
              String(currentUser._id)

          )

        );

      }

      const commentResponse =
        await api.get(
          `/comments/${id}`
        );

      setComments(
        commentResponse.data
      );

    } catch (error) {

      console.log(error);

    }

  };

  // Delete Blog

  const handleDelete = async () => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this post?"
      );

    if (!confirmDelete) return;

    try {

      await api.delete(
        `/posts/${post._id}`
      );

      alert(
        "Post Deleted Successfully"
      );

      navigate("/");

    } catch (error) {

      console.log(error);

      alert(

        error.response?.data?.message ||

        "Delete Failed"

      );

    }

  };

  // Like / Unlike

  const handleLike = async () => {

    if (likeLoading) return;

    setLikeLoading(true);

    try {

      const { data } =
        await api.put(
          `/posts/${id}/like`
        );

      setLikeCount(
        data.totalLikes
      );

      setLiked(
        (prev) => !prev
      );

    } catch (error) {

      console.log(error);

      alert(
        "Failed to update like."
      );

    } finally {

      setLikeLoading(false);

    }

  };

  // Add Comment

  const handleCommentSubmit =
    async () => {

      if (
        !newComment.trim()
      ) {

        alert(
          "Please enter a comment."
        );

        return;

      }

      try {

        await api.post(
          `/comments/${id}`,
          {
            comment: newComment,
          }
        );

        const { data } =
          await api.get(
            `/comments/${id}`
          );

        setComments(data);

        setNewComment("");

        alert(
          "Comment Added Successfully"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed to Add Comment"
        );

      }

    };

  // Delete Comment

  const handleDeleteComment =
    async (commentId) => {

      const confirmDelete =
        window.confirm(
          "Delete this comment?"
        );

      if (!confirmDelete) return;

      try {

        await api.delete(
          `/comments/${commentId}`
        );

        const { data } =
          await api.get(
            `/comments/${id}`
          );

        setComments(data);

        alert(
          "Comment Deleted"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed to Delete Comment"
        );

      }

    };

  // Loading

  if (!post) {

    return (

      <div className="container mt-5 text-center">

        <div className="spinner-border text-primary"></div>

        <p className="mt-3">

          Loading Blog...

        </p>

      </div>

    );

  }

  // Owner Check

  const isOwner =

    currentUser &&

    post.author &&

    String(currentUser._id) ===

    String(post.author._id);

  return (

    <div className="container mt-5">

  <div className="row justify-content-center">

    <div className="col-lg-10">

      <div className="card shadow-lg">

        {/* Blog Image */}

        {post.image && (

          <img
            src={`http://localhost:5000${post.image}`}
            className="card-img-top"
            style={{
              maxHeight: "500px",
              objectFit: "cover",
            }}
            alt={post.title}
          />

        )}

        <div className="card-body">

          {/* Blog Title */}

          <h1 className="mb-3">

            {post.title}

          </h1>

          {/* Category */}

          <div className="mb-3">

            <span className="badge bg-success fs-6">

              {post.category}

            </span>

          </div>

          {/* Author */}

          <p className="text-muted">

            <strong>👤 Author :</strong>{" "}

            {post.author?.name}

          </p>

          {/* Published Date */}

          <p className="text-muted">

            📅 Published on{" "}

            {new Date(
              post.createdAt
            ).toLocaleDateString()}

          </p>

          <hr />

          {/* Blog Content */}

          <p
            style={{
              lineHeight: "2",
              fontSize: "18px",
              textAlign: "justify",
            }}
          >

            {post.content}

          </p>

          <hr />

          {/* Like Section */}

          <div className="d-flex align-items-center mb-4">

            <button
              className={
                liked
                  ? "btn btn-danger"
                  : "btn btn-outline-danger"
              }
              onClick={handleLike}
              disabled={likeLoading}
            >

              {likeLoading
                ? "Updating..."
                : liked
                ? "❤️ Unlike"
                : "🤍 Like"}

            </button>

            <span className="ms-3 fw-bold">

              ❤️ {likeCount} Likes

            </span>

          </div>

          <hr />

          {/* Owner Buttons */}

          {isOwner && (

            <div className="mb-4">

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
                className="btn btn-danger ms-3"
                onClick={handleDelete}
              >
                Delete
              </button>

            </div>

          )}

          <hr className="my-5" />
                    {/* COMMENTS */}

          <h3 className="mb-4">

            💬 Comments ({comments.length})

          </h3>

          {comments.length === 0 ? (

            <div className="alert alert-info">

              No comments yet. Be the first to comment!

            </div>

          ) : (

            comments.map((comment) => (

              <div
                className="card mb-3 shadow-sm"
                key={comment._id}
              >

                <div className="card-body">

                  <div className="d-flex justify-content-between align-items-center">

                    <h6 className="fw-bold mb-0">

                      👤 {comment.user?.name}

                    </h6>

                    <small className="text-muted">

                      📅{" "}
                      {new Date(
                        comment.createdAt
                      ).toLocaleDateString()}

                    </small>

                  </div>

                  <hr />

                  <p className="mb-3">

                    {comment.comment}

                  </p>

                  {currentUser &&
                    comment.user &&
                    String(currentUser._id) ===
                      String(comment.user._id) && (

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          handleDeleteComment(
                            comment._id
                          )
                        }
                      >
                        🗑 Delete
                      </button>

                    )}

                </div>

              </div>

            ))

          )}

          <hr className="my-5" />

          {/* ADD COMMENT */}

          <h4 className="mb-3">

            💬 Add Comment

          </h4>

          <textarea
            className="form-control"
            rows="4"
            placeholder="Write your comment here..."
            value={newComment}
            onChange={(e) =>
              setNewComment(
                e.target.value
              )
            }
          />

          <button
            className="btn btn-primary mt-3"
            onClick={
              handleCommentSubmit
            }
          >
            💬 Post Comment
          </button>

        </div>

      </div>

    </div>

  </div>

</div>

  );

}

export default PostDetailsPage;