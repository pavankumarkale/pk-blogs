import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function HomePage() {

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [loadingLikeId, setLoadingLikeId] =
    useState(null);

  useEffect(() => {

    const fetchPosts = async () => {

      try {

        const { data } =
          await api.get("/posts");

        setPosts(data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchPosts();

  }, []);

  const handleLike = async (postId) => {

    if (loadingLikeId) return;

    setLoadingLikeId(postId);

    try {

      await api.put(`/posts/${postId}/like`);

      const { data } =
        await api.get("/posts");

      setPosts(data);

    } catch (error) {

      console.log(error);

      alert("Failed to update like.");

    } finally {

      setLoadingLikeId(null);

    }

  };

  // Search + Category Filter

  const filteredPosts = posts.filter((post) => {

    const matchesSearch =

      post.title
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      post.category
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =

      selectedCategory === "All"

      ||

      post.category === selectedCategory;

    return (
      matchesSearch &&
      matchesCategory
    );

  });

  // Sorting

  const sortedPosts = [...filteredPosts];

  switch (sortOption) {

    case "oldest":

      sortedPosts.sort(

        (a, b) =>

          new Date(a.createdAt) -

          new Date(b.createdAt)

      );

      break;

    case "titleAsc":

      sortedPosts.sort(

        (a, b) =>

          a.title.localeCompare(b.title)

      );

      break;

    case "titleDesc":

      sortedPosts.sort(

        (a, b) =>

          b.title.localeCompare(a.title)

      );

      break;

    default:

      sortedPosts.sort(

        (a, b) =>

          new Date(b.createdAt) -

          new Date(a.createdAt)

      );

  }

  // Pagination

  const postsPerPage = 6;

  const indexOfLastPost =
    currentPage * postsPerPage;

  const indexOfFirstPost =
    indexOfLastPost - postsPerPage;

  const currentPosts =
    sortedPosts.slice(
      indexOfFirstPost,
      indexOfLastPost
    );

  const totalPages = Math.ceil(
    sortedPosts.length / postsPerPage
  );

  const pageNumbers = [];

  for (
    let i = 1;
    i <= totalPages;
    i++
  ) {

    pageNumbers.push(i);

  }

if (loading) {

  return (

    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "70vh" }}
    >

      <div className="text-center">

        <div
          className="spinner-border text-primary mb-3"
          role="status"
        ></div>

        <h4 className="fw-bold">

          Loading Blogs...

        </h4>

      </div>

    </div>

  );

}

  return (
  <div
  className="container py-5"
  style={{
    minHeight: "80vh",
  }}
>

 <div className="text-center mb-5">

  <h1 className="display-5 fw-bold">

    📰 Latest Blogs

  </h1>

  <p className="text-muted">

    Discover articles shared by our amazing community.

  </p>

</div>

  {/* Search */}

 <div className="row justify-content-center mb-5">

  <div className="col-lg-6 col-md-8 col-sm-12">

    <input
      type="text"
      className="form-control form-control-lg rounded-pill shadow-sm"
      placeholder="Search blogs by title or category..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
    />

  </div>

</div>

  {/* Sort */}

<div className="row justify-content-center mb-5">

  <div className="col-lg-4 col-md-6 col-sm-12">

    <select
      className="form-select form-select-lg shadow-sm"
        value={sortOption}
        style={{
  cursor: "pointer",
}}
        onChange={(e) => {
          setSortOption(e.target.value);
          setCurrentPage(1);
        }}
      >

        <option value="newest">
          Newest First
        </option>

        <option value="oldest">
          Oldest First
        </option>

        <option value="titleAsc">
          Title (A-Z)
        </option>

        <option value="titleDesc">
          Title (Z-A)
        </option>

      </select>

    </div>

  </div>

  {/* Categories */}

  <h5 className="text-center mb-3 fw-bold">

  Browse by Category

</h5>

  <div className="text-center mb-5">

    {[
  "All",
  ...new Set(posts.map((post) => post.category))
].map((category) => (

      <button
        key={category}
        className={
          selectedCategory === category
  ? "btn btn-primary rounded-pill btn-sm me-2 mb-2 px-3"
  : "btn btn-outline-primary rounded-pill btn-sm me-2 mb-2 px-3"
        }
        onClick={() => {
          setSelectedCategory(category);
          setCurrentPage(1);
        }}
      >
        {category}
      </button>

    ))}

  </div>

  {/* Blog Cards */}

  <div className="row">

    {posts.length === 0 ? (

      <div className="text-center my-5">

  <h3>

    📭 No Blogs Available

  </h3>

  <p className="text-muted">

    Be the first one to create a blog.

  </p>

</div>

    ) : filteredPosts.length === 0 ? (
<div
  className="text-center my-5"
  style={{
    padding: "50px",
  }}
>

  <h3>

    😔 No blogs found

  </h3>

  <p className="text-muted">

    Try another keyword or category.

  </p>

</div>

    ) : (

      currentPosts.map((post) => (

      <div
  className="col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-4"
  key={post._id}
>

     <div
  className="card h-100 border-0 shadow-sm"
  style={{
    borderRadius: "18px",
    transition: "all .35s ease",
    overflow: "hidden",
    cursor: "pointer",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-8px)";
    e.currentTarget.style.boxShadow =
      "0 15px 35px rgba(0,0,0,0.15)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "";
  }}
>

            {post.image && (

              <img
                src={post.image}
                className="card-img-top"
               style={{
  height: "230px",
  width: "100%",
  objectFit: "cover",
  borderTopLeftRadius: "18px",
  borderTopRightRadius: "18px",
  transition: "transform .4s ease",
}}
                alt={post.title}
              />

            )}

       <div
  className="card-body d-flex flex-column"
  style={{
    padding: "25px",
  }}
>

              <h4 className="card-title fw-bold mb-3">

                {post.title}

              </h4>

              <span className="badge bg-success rounded-pill px-3 py-2 mb-3">

                {post.category}

              </span>

              <p
  className="card-text text-muted"
  style={{
    flexGrow: 1,
    lineHeight: "1.7",
  }}
>

                {post.content.length > 100
                  ? post.content.substring(0, 100) + "..."
                  : post.content}

              </p>

            </div>

            <div
  className="card-footer bg-white border-0"
>

              <div className="d-flex justify-content-between align-items-center">

                <div
  className="d-flex align-items-center"
  style={{
    minHeight: "50px",
  }}
>

  {post.author?.profileImage ? (

    <img
      src={post.author.profileImage}
      alt={post.author.name}
      className="rounded-circle me-2"
      style={{
  width: "45px",
  height: "45px",
  objectFit: "cover",
  border: "2px solid #0d6efd",
}}
    />

  ) : (

    <div
      className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-2"
      style={{
  width: "45px",
  height: "45px",
  fontSize: "18px",
  fontWeight: "bold",
}}
    >

      {post.author?.name
        ?.charAt(0)
        .toUpperCase()}

    </div>

  )}

 <small
  className="text-dark fw-semibold"
>

    {post.author?.name}

  </small>

</div>

                <span
  className="badge bg-danger rounded-pill px-3 py-2"
>

                  ❤️ {post.likes?.length || 0} Likes

                </span>

              </div>

              <div className="mt-3">

                <button
                  className={
  post.likes?.some(
    (id) =>
      String(id) ===
      String(currentUser?._id)
  )
    ? "btn btn-danger rounded-pill w-100 shadow-sm"
    : "btn btn-outline-danger rounded-pill w-100 shadow-sm"
}
                  onClick={() =>
                    handleLike(post._id)
                  }
                  disabled={
                    loadingLikeId === post._id
                  }
                >

                  {loadingLikeId === post._id
  ? "Updating..."
  : post.likes?.some(
      (id) =>
        String(id) ===
        String(currentUser?._id)
    )
  ? "❤️ Liked"
  : "🤍 Like Post"}

                </button>

              </div>

              <Link
                to={`/post/${post._id}`}
                className="btn btn-primary rounded-pill w-100 mt-3 shadow-sm"
              >
               📖 Read Full Article
              </Link>

            </div>

          </div>

        </div>

      ))

    )}

  </div>

        {/* Pagination */}

      {totalPages > 1 && (

        <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mt-5">

          <button
            className="btn btn-primary rounded-pill px-4"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(currentPage - 1)
            }
          >
          ← Previous
          </button>

          <div className="d-flex">

            {pageNumbers.map((number) => (

              <button
                key={number}
                className={
                  currentPage === number
  ? "btn btn-primary rounded-circle mx-1"
  : "btn btn-outline-primary rounded-circle mx-1"
                }
                style={{
  width: "45px",
  height: "45px",
}}
                onClick={() =>
                  setCurrentPage(number)
                }
              >
                {number}
              </button>

            ))}

          </div>

          <button
            className="btn btn-primary rounded-pill px-4"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage(currentPage + 1)
            }
          >
          Next →
          </button>

        </div>

      )}

    </div>

  );

}

export default HomePage;