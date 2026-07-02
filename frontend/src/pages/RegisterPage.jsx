import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

function RegisterPage() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const { data } = await api.post(
        "/users/register",
        {
          name,
          email,
          password,
        }
      );

      console.log(data);

      toast.success("Registration Successful");

      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Registration Failed"
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

                <h1 className="text-success fw-bold">

                  PK BLOGS

                </h1>

                <h3 className="fw-bold mt-3">

                  Create Account 🚀

                </h3>

                <p className="text-muted">

                  Join our blogging community

                </p>

              </div>

              <form onSubmit={handleSubmit}>

                {/* Name */}

                <div className="mb-4">

                  <label className="form-label fw-bold">

                    Full Name

                  </label>

                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                  />

                </div>

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

                {/* Register Button */}

                <button
                  type="submit"
                  className="btn btn-success btn-lg rounded-pill w-100"
                  disabled={loading}
                >

                  {loading
                    ? "Creating Account..."
                    : "Register"}

                </button>

                {/* Login */}

                <div className="text-center mt-4">

                  <span className="text-muted">

                    Already have an account?

                  </span>

                  {" "}

                  <Link
                    to="/login"
                    className="fw-bold text-decoration-none"
                  >

                    Login

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

export default RegisterPage;