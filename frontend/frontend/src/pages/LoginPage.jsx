import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const { data } = await api.post(
        "/users/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      toast.success("Login Successful");

      navigate("/");

    } catch (error) {

      toast.error(
  error.response?.data?.message ||
  "Login Failed"
);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div
      className="container d-flex justify-content-center align-items-center"
      style={{
        minHeight: "90vh",
      }}
    >

      <div className="row justify-content-center w-100">

        <div className="col-lg-5 col-md-7 col-sm-11">

          <div
            className="card border-0 shadow-lg"
            style={{
              borderRadius: "20px",
            }}
          >

            <div className="card-body p-5">

              <div className="text-center mb-4">

                <h1
                  className="fw-bold text-primary"
                >
                  PK BLOGS
                </h1>

                <h3 className="fw-bold mt-3">

                  Welcome Back 👋

                </h3>

                <p className="text-muted">

                  Login to continue

                </p>

              </div>

              <form onSubmit={handleSubmit}>

                {/* Email */}

                <div className="mb-4">

                  <label className="form-label fw-bold">

                    Email Address

                  </label>

                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />

                </div>

                {/* Password */}

                <div className="mb-4">

                  <label className="form-label fw-bold">

                    Password

                  </label>

                  <div className="input-group">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      className="form-control form-control-lg"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                    >
                      {showPassword
                        ? "🙈"
                        : "👁"}
                    </button>

                  </div>

                </div>

                {/* Login Button */}

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 rounded-pill"
                  disabled={loading}
                >

                  {loading
                    ? "Logging In..."
                    : "Login"}

                </button>

                {/* Forgot Password */}

                <div className="text-center mt-4">

                  <Link
                    to="/forgot-password"
                    className="text-decoration-none"
                  >

                    Forgot Password?

                  </Link>

                </div>

                {/* Register */}

                <div className="text-center mt-3">

                  <span className="text-muted">

                    Don't have an account?

                  </span>

                  {" "}

                  <Link
                    to="/register"
                    className="fw-bold text-decoration-none"
                  >

                    Register

                  </Link>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default LoginPage;