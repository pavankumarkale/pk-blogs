import React from "react";

function AboutPage() {
  return (
    <div className="container py-5">

      {/* Heading */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">
          About PK BLOGS
        </h1>

        <p className="text-muted fs-5">
          A Full Stack MERN Blog Platform built with modern web technologies.
        </p>
      </div>

      {/* About Project */}
      <div className="card shadow border-0 mb-5">
        <div className="card-body p-4">

          <h3 className="text-success mb-3">
            📖 Project Overview
          </h3>

          <p className="text-muted">
            PK BLOGS is a modern blogging platform developed using the
            MERN Stack (MongoDB, Express.js, React.js and Node.js).
            It allows users to create, edit, delete and manage blogs
            securely using JWT authentication.
          </p>

        </div>
      </div>

      {/* Features */}
      <div className="row">

        <div className="col-md-6 mb-4">

          <div className="card h-100 shadow-sm">

            <div className="card-body">

              <h4 className="text-primary">
                🚀 Features
              </h4>

              <ul className="mt-3">

                <li>User Registration & Login</li>
                <li>JWT Authentication</li>
                <li>Create / Edit / Delete Posts</li>
                <li>Like & Unlike Posts</li>
                <li>Comments System</li>
                <li>Notifications</li>
                <li>Profile Image Upload</li>
                <li>Forgot Password via Email</li>
                <li>Admin Dashboard</li>
                <li>Responsive UI</li>

              </ul>

            </div>

          </div>

        </div>

        <div className="col-md-6 mb-4">

          <div className="card h-100 shadow-sm">

            <div className="card-body">

              <h4 className="text-success">
                🛠 Technologies
              </h4>

              <ul className="mt-3">

                <li>React.js</li>
                <li>Node.js</li>
                <li>Express.js</li>
                <li>MongoDB Atlas</li>
                <li>Bootstrap 5</li>
                <li>JWT Authentication</li>
                <li>Multer</li>
                <li>Nodemailer</li>
                <li>React Router DOM</li>
                <li>Axios</li>

              </ul>

            </div>

          </div>

        </div>

      </div>

      {/* Objective */}
      <div className="card shadow border-0 mt-4">

        <div className="card-body p-4">

          <h3 className="text-warning">
            🎯 Project Objective
          </h3>

          <p className="text-muted mt-3">

            The objective of this project is to provide a secure,
            responsive and user-friendly blogging platform where users
            can share knowledge, interact with others through likes
            and comments, and manage their profiles efficiently.

          </p>

        </div>

      </div>

      {/* Developer */}
      <div className="card shadow border-0 mt-4">

        <div className="card-body p-4">

          <h3 className="text-danger">

            👨‍💻 Developer

          </h3>

          <p className="mt-3">

            <strong>Name:</strong> Pavan Kumar Kale

          </p>

          <p>

            <strong>Project:</strong> PK BLOGS

          </p>

          <p>

            <strong>Technology:</strong> MERN Stack

          </p>

        </div>

      </div>

    </div>
  );
}

export default AboutPage;