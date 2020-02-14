const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/level1DB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ username: username }, (err, result) => {
      if (!err) {
        if (result) {
          if (result.password === password) {
            res.render("secret");
          } else {
            console.log("Incorect Password");
            res.render("error", {
              message: "Incorrect password! make sure your password is correct."
            });
          }
        } else {
          console.log("Register Yourself");
          res.render("error", {
            message: "Not Registered! make sure you register yourself."
          });
        }
      } else {
        console.log(err);
        res.render("error", {
          message: "Error! Try again after sometime."
        });
      }
    });
  });

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const newUser = new User({
      username: username,
      password: password
    });
    newUser.save().then(() => {
      console.log("Successfully registered.");
      res.render("error", {
        message: "Woohu! Sucessfully register."
      });
    });
  });

app.listen(3000, () => {
  console.log("Server has been started at port no. 3000.");
});
