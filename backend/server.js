
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const uploadRoutes =require("./routes/uploadRoutes");

const notificationRoutes = require(
  "./routes/notificationRoutes"
);

const adminRoutes = require("./routes/adminRoutes");
const commentRoutes = require("./routes/commentRoutes");
const contactRoutes = require(
  "./routes/contactRoutes"
);

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

const limiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 100,

  message: {
    message:
      "Too many requests. Please try again later.",
  },

});
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);
app.use(limiter);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://pk-blogs.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);



app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use("/api/upload", uploadRoutes);
app.use(
  "/api/notifications",
  notificationRoutes
);
app.use("/api/admin", adminRoutes);
app.use("/api/comments", commentRoutes);
app.use(
  "/api/contact",
  contactRoutes
);
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On ${PORT}`);
});