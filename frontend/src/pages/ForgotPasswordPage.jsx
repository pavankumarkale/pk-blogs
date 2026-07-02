import { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

function ForgotPasswordPage() {

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const { data } = await api.post(
        "/users/forgot-password",
        {
          email,
        }
      );

      toast.success(data.message);

      setEmail("");

    } catch (error) {

      console.log(error);

      toast.error(
  error.response?.data?.message ||
  "Something went wrong"
);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <div className="card shadow">

            <div className="card-body">

              <h2 className="text-center mb-4">

                Forgot Password

              </h2>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">

                  <label className="form-label">

                    Email Address

                  </label>

                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />

                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading
                    ? "Sending..."
                    : "Send Reset Link"}
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default ForgotPasswordPage;