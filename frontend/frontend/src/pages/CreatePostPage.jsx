import { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

function CreatePostPage() {

  const [title, setTitle] =
    useState("");

  const [content, setContent] =
    useState("");

    const [image, setImage] = useState(null);

const [imagePath, setImagePath] =
  useState("");
  const [category, setCategory] = useState("");


  const handleImageUpload = async (
  e
) => {

  const file = e.target.files[0];

  setImage(file);

  const formData =
    new FormData();

  formData.append(
    "image",
    file
  );

  try {

    const { data } =
      await api.post(
        "/upload",
        formData
      );

    setImagePath(
      data.imagePath
    );

    toast.success("Image Uploaded");

  } catch (error) {

    toast.error("Upload Failed");

    console.log(error);
  }
};

  const handleSubmit = async (e) => {

    e.preventDefault();
     if (!title || !content || !category) {

    toast.error("Please fill all fields");

    return;

  }

    try {

      const { data } =
        await api.post("/posts", {
          title,
          content,
          image: imagePath,
          category,
        });

      console.log(data);

      toast.success("Post Created Successfully");

      setTitle("");
      setContent("");
      setImagePath("");
    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to create post"
      );
    }
  };

  return (
  <div className="container mt-5">

    <div className="row justify-content-center">

      <div className="col-md-8">

        <div className="card shadow">

          <div className="card-body">

            <h2 className="text-center mb-4">
              Create Blog Post
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">

                <label className="form-label">
                  Blog Image
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

  <option value="">
    Select Category
  </option>

  <option value="Technology">
    Technology
  </option>

  <option value="Entertainment">
    Entertainment
  </option>

  <option value="Games">
    Games
  </option>

  <option value="Sports">
    Sports
  </option>

  <option value="Stories">
    Stories
  </option>

  <option value="Education">
    Education
  </option>

  <option value="Travel">
    Travel
  </option>

  <option value="Food">
    Food
  </option>

  <option value="Health">
    Health
  </option>

  <option value="Business">
    Business
  </option>

  <option value="Lifestyle">
    Lifestyle
  </option>

  

  <option value="Other">
    Other
  </option>

</select>

</div>

              <div className="mb-3">

                <label className="form-label">
                  Title
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

              </div>

              <div className="mb-4">

                <label className="form-label">
                  Content
                </label>

                <textarea
                  rows="8"
                  className="form-control"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />

              </div>

              <button
                className="btn btn-success w-100"
              >
                Publish Blog
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>

  </div>
);
}

export default CreatePostPage;