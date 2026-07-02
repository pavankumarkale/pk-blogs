import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreatePostPage from "./pages/CreatePostPage";
import PostDetailsPage from "./pages/PostDetailsPage";
import ProtectedRoute from "./components/ProtectedRoute";

import EditPostPage from "./pages/EditPostPage";
import MyPostsPage from "./pages/MyPostsPage";
import ProfilePage from "./pages/ProfilePage";

import AdminDashboard from "./pages/AdminDashboard";

import NotificationsPage from "./pages/NotificationsPage";

import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
  path="/admin"
  element={<AdminDashboard />}
/>

<Route
  path="/notifications"
  element={<NotificationsPage />}
/>
        <Route
  path="/profile"
  element={<ProfilePage />}
/>

<Route
  path="/forgot-password"
  element={<ForgotPasswordPage />}
/>

<Route
  path="/contact"
  element={<ContactPage />}
/>
<Route
  path="/about"
  element={<AboutPage />}
/>

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
  path="/create-post"
  element={
    <ProtectedRoute>
      <CreatePostPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/my-posts"
  element={<MyPostsPage />}
/>

        <Route
          path="/post/:id"
          element={<PostDetailsPage />}
        />

        <Route
  path="/edit-post/:id"
  element={
    <ProtectedRoute>
      <EditPostPage />
    </ProtectedRoute>
  }
/>

<Route
  path="*"
  element={<NotFoundPage />}
/>

      </Routes>
      <Footer />

    </BrowserRouter>
  );
}

export default App;