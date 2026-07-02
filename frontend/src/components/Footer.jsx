import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-light mt-5 pt-5 pb-3">

      <div className="container">

        <div className="row">

          {/* Website */}

          <div className="col-lg-4 mb-4">

            <h3 className="fw-bold text-info">
              PK BLOGS
            </h3>

            <p className="text-light mt-3">

              Share your ideas with the world using
              our modern MERN Blog platform.

            </p>

          </div>

          {/* Quick Links */}

          <div className="col-lg-4 mb-4">

            <h5 className="fw-bold">

              Quick Links

            </h5>

            <ul className="list-unstyled mt-3">

              <li className="mb-2">
                <Link
                  className="text-decoration-none text-light"
                  to="/"
                >
                  Home
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  className="text-decoration-none text-light"
                  to="/create-post"
                >
                  Create Post
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  className="text-decoration-none text-light"
                  to="/contact"
                >
                  Contact
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  className="text-decoration-none text-light"
                  to="/about"
                >
                  About
                </Link>
              </li>

            </ul>

          </div>

          {/* Contact */}

          <div className="col-lg-4 mb-4">

            <h5 className="fw-bold">

              Connect

            </h5>

            <ul className="list-unstyled mt-3">

              <li className="mb-2">
                📧 kalepavan862@gmail.com
              </li>

              <li className="mb-2">
                💻 github.com/yourgithub
              </li>

              <li className="mb-2">
                🔗 linkedin.com/in/yourprofile
              </li>

            </ul>

          </div>

        </div>

        <hr />

        <div className="text-center">

          <small>

            © {new Date().getFullYear()} PK BLOGS |
            Built with ❤️ using MERN Stack

          </small>

        </div>

      </div>

    </footer>
  );
}

export default Footer;