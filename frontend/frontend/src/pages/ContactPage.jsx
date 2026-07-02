import { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

function ContactPage() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const { data } = await api.post(
        "/contact",
        formData
      );

      toast.success(data.message);

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to send message."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-8">

          <div className="card shadow">

            <div className="card-body">

              <h2 className="text-center mb-4">

                📩 Contact Us

              </h2>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">

                  <label>Name</label>

                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="mb-3">

                  <label>Email</label>

                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="mb-3">

                  <label>Subject</label>

                  <input
                    type="text"
                    className="form-control"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="mb-3">

                  <label>Message</label>

                  <textarea
                    rows="6"
                    className="form-control"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>

                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading
                    ? "Sending..."
                    : "Send Message"}
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default ContactPage;