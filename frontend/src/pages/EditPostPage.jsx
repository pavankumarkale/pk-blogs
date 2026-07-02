import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePath, setImagePath] = useState("");

  const [category, setCategory] = useState("Technology");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);

        setTitle(data.title);
        setContent(data.content);
        setImagePath(data.image);
        setCategory(data.category);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await api.post("/upload", formData);

      setImagePath(data.imagePath);

      toast.success("Image Uploaded Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Image Upload Failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Title and Content are required");
      return;
    }

    try {
      await api.put(`/posts/${id}`, {
        title,
        content,
        image: imagePath,
        category,
      });

      toast.success("Post Updated Successfully");

      navigate(`/post/${id}`);
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update post"
      );
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-8">

          <div className="card shadow">

            <div className="card-body">

              <h2 className="text-center mb-4">
                Edit Blog
              </h2>

              <form onSubmit={handleSubmit}>

                {/* Current Image */}

                <div className="mb-3">

                  <label className="form-label">
                    Current Image
                  </label>

                  <br />

                  {imagePath && (
                    <img
                      src={`http://localhost:5000${imagePath}`}
                      alt="Blog"
                      className="img-fluid rounded mb-3"
                      style={{
                        maxHeight: "250px",
                      }}
                    />
                  )}

                </div>

                {/* Upload New Image */}

                <div className="mb-3">

                  <label className="form-label">
                    Change Image
                  </label>

                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageUpload}
                  />

                </div>

                <div className="mb-3">

  <label className="form-label">
    Category
  </label>

  <select
    className="form-select"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
  >

     <option value="">Select Category</option>

  <option value="Technology">Technology</option>

  <option value="Entertainment">Entertainment</option>

  <option value="Games">Games</option>

  <option value="Sports">Sports</option>

  <option value="Stories">Stories</option>

  <option value="Education">Education</option>

  <option value="Travel">Travel</option>

  <option value="Food">Food</option>

  <option value="Health">Health</option>

  <option value="Business">Business</option>

  <option value="Lifestyle">Lifestyle</option>

  <option value="Other">Other</option>

  </select>

</div>

                {/* Title */}

                <div className="mb-3">

                  <label className="form-label">
                    Title
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                  />

                </div>

                {/* Content */}

                <div className="mb-4">

                  <label className="form-label">
                    Content
                  </label>

                  <textarea
                    rows="8"
                    className="form-control"
                    value={content}
                    onChange={(e) =>
                      setContent(e.target.value)
                    }
                  />

                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
                >
                  Update Post
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default EditPostPage;