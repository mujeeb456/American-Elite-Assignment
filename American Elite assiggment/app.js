const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windows: 60 * 60 * 1000,
  messasge: "Too many  requests from this IP, please try again after an hours",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());

app.use(xss());

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.use("/", overviewRouter);
app.use("/api/users", userRouter);
// app.use("/api/post", postRouter);

module.exports = app;
