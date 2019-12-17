const express = require("express");
const passport = require("passport");
const session = require("express-session");
const YoungstargramStrategy = require("../lib/index").Strategy;

const client_id = "test";
const client_secret = "123";
const callback_url = "/callback";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new YoungstargramStrategy(
    {
      clientID: client_id,
      clientSecret: client_secret,
      callbackURL: callback_url
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        user = {
          username: profile.username,
          name: profile.name
        };

        return done(null, profile);
      });
    }
  )
);

const app = express();

app.use(
  session({ secret: "youngstar", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "jade");
app.set("views", __dirname + "/views");

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

app.get(
  "/auth/youngstar",
  passport.authenticate("youngstargram", null),
  (req, res) => {}
);

app.get(
  "/callback",
  passport.authenticate("youngstargram", {
    failureRedirect: "/login"
  }),
  (req, res) => {
    res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

app.listen(5500);
