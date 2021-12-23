//Express
const path = require("path");
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

//EJS Mate (Boilerplaiting EJS)
const ejsMate = require("ejs-mate");

//Util Scripts and Schemas
const ExpressError = require("./utils/ExpressError");

//MongoDB (Mongoose)
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongoose connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("home");
});

// Error Handlers:
//404 error
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// General Response
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Express Listening on port 3000");
});
