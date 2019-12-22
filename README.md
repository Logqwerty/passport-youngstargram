# passport-youngstargram
Passport strategy for Youngstargram OAuth 2.0

## install

```
npm -i passport-youngstargram
```

## example

```javascript
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const YoungstargramStrategy = require("passport-youngstargram");

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
      const user = {
        username: profile.displayName,
        name: profile.name,
        profileImage: profile.photos[0].value
      };
      return done(null, user);
    }
  )
);

app.get("/", (req, res) => {
  res.render("index");
});

app.get(
  "/auth/youngstargram",
  passport.authenticate("youngstargram", null),
);

app.get(
  "/callback",
  passport.authenticate("youngstargram", {
    failureRedirect: "/login",
    successRedirect: "/"
  })
);

app.get("/logout", (req, res) => {
  req.logOut();
  req.session.destroy(err => {
    if (err) return next(err);
    res.clearCookie("connect.sid", { path: "/" });
    res.redirect("/");
  });
});
```

