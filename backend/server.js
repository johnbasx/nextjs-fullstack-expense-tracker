const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// import routes
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const transactionRoutes = require("./routes/transactions");
const userRoutes = require("./routes/user");

// app
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// database connect
mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.log("MongoDB connection error!");
    console.log(err);
  });

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

// cors
app.use(cors());
// if (process.env.NODE_ENV === "development") {
//   app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
// }

// api routes middleware
app.use("/api", categoryRoutes);
app.use("/api", authRoutes);
app.use("/api", transactionRoutes);
app.use("/api", userRoutes);

/// port initialization
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port : http://localhost:${port}`);
});
