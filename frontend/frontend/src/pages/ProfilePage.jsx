import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import api from "../services/api";

function ProfilePage() {

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");

const [selectedImage, setSelectedImage] = useState(null);

const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [memberSince, setMemberSince] = useState("");
  const [totalPosts, setTotalPosts] = useState(0);
const [totalComments, setTotalComments] = useState(0);

  useEffect(() => {

  const fetchProfile = async () => {

    try {

      const { data } =
        await api.get("/users/profile");

      setName(data.name);

      setEmail(data.email);
      setProfileImage(data.profileImage || "");
      setMemberSince(data.createdAt);
      setTotalPosts(data.totalPosts);

setTotalComments(data.totalComments);

    } catch (error) {

      console.log(error);

      alert("Failed to load profile");

    } finally {

      setLoading(false);

    }

  };

  fetchProfile();

}, []);

const handleProfileImageUpload = async () => {

  if (!selectedImage) {

    alert("Please choose an image.");

    return;

  }

  const formData = new FormData();

  formData.append("image", selectedImage);

  try {

    setUploading(true);

    const { data } = await api.put(
  "/users/profile/image",
  formData
);

setProfileImage(data.profileImage);

// Update localStorage
const user = JSON.parse(
  localStorage.getItem("user")
);

user.profileImage = data.profileImage;

localStorage.setItem(
  "user",
  JSON.stringify(user)
);

toast.success("Profile image uploaded successfully.");

  } catch (error) {

    console.log(error);

    alert(
      error.response?.data?.message ||
      "Upload failed."
    );

  } finally {

    setUploading(false);

  }

};

const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const { data } =
      await api.put(
        "/users/profile",
        {
          name,
          password,
        }
      );

    toast.success(data.message);

    // Update localStorage

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    user.name = data.name;

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    // Clear Password Box

    setPassword("");

  } catch (error) {

    console.log(error);

    toast.error(
  error.response?.data?.message ||
  "Profile Update Failed"
);

  }

};

if (loading) {

  return (

    <div className="container mt-5">

      <h2>Loading...</h2>

    </div>

  );

}

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <div className="card shadow">

            <div className="card-body">

             <h2 className="text-center mb-2">
  My Profile
</h2>

<p className="text-center text-muted mb-4">
  Manage your account information
</p>

<div className="text-center mb-4">

  {profileImage ? (

  <img
    src={`http://localhost:5000${profileImage}`}
    alt="Profile"
    className="rounded-circle"
    style={{
      width: "120px",
      height: "120px",
      objectFit: "cover",
      border: "3px solid #0d6efd",
    }}
  />

) : (

  <div
    className="rounded-circle bg-primary text-white d-inline-flex justify-content-center align-items-center"
    style={{
      width: "120px",
      height: "120px",
      fontSize: "48px",
      fontWeight: "bold",
    }}
  >
    {name ? name.charAt(0).toUpperCase() : "U"}
  </div>

)}

<div className="mt-3">

  <input
    type="file"
    className="form-control"
    accept="image/*"
    onChange={(e) =>
      setSelectedImage(e.target.files[0])
    }
  />
<button
  type="button"
  className="btn btn-primary mt-3"
  onClick={handleProfileImageUpload}
  disabled={uploading}
>

  {uploading
    ? "Uploading..."
    : "Upload Profile Picture"}

</button>
</div>

</div>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">

                  <label className="form-label fw-bold">

  Change Name

</label>

                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                  />

                </div>

                <div className="mb-3">

                  <div className="mb-3">

  <strong>Email</strong>

  <div className="form-control bg-light">

    {email}

  </div>

</div>

                </div>

                <div className="mb-3">

  <div className="mb-3">

  <strong>Member Since</strong>

  <div className="form-control bg-light">

    {memberSince
      ? new Date(memberSince).toLocaleDateString()
      : ""}

  </div>

</div>

</div>


<div className="mb-3">

  <strong>Total Posts</strong>

  <div className="form-control bg-light">

    {totalPosts}

  </div>

</div>

<div className="mb-3">

  <strong>Total Comments</strong>

  <div className="form-control bg-light">

    {totalComments}

  </div>

</div>

                <div className="mb-3">

                  <label className="form-label fw-bold">

  Change Password

</label>

                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />

                </div>

              <button
  type="submit"
  className="btn btn-success w-100 mt-3"
>
  Save Changes
</button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default ProfilePage;