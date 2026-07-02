import { Link } from "react-router-dom";

function NotFoundPage() {

  return (

    <div
      className="container d-flex justify-content-center align-items-center"
      style={{
        minHeight: "85vh",
      }}
    >

      <div className="text-center">

        <h1
          className="display-1 fw-bold text-danger"
        >
          404
        </h1>

        <h2 className="fw-bold mt-3">

          Oops! Page Not Found

        </h2>

        <p className="text-muted mt-3">

          The page you are looking for doesn't exist
          or has been moved.

        </p>

        <Link
          to="/"
          className="btn btn-primary btn-lg rounded-pill mt-4 px-5"
        >

          🏠 Back to Home

        </Link>

      </div>

    </div>

  );

}

export default NotFoundPage;