const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(***REMOVED***);

module.exports = {

  signUp(req, res, next){
    res.render("users/sign_up");
  },

  create(req, res, next){
    let newUser = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };
    let msg = {
      to: req.body.email,
      from: 'xiaokangt@hotmail.com',
      subject: 'User created',
      text: 'Your have been registered as a new user!',
      html: '<strong>Your have been registered as a new user!</strong>'
    };
    userQueries.createUser(newUser, (err, user) => {
      if(err){
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else{
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          sgMail.send(msg);
          res.redirect("/");
        })
      }
    });
  },

  signInForm(req, res, next){
    res.render("users/sign_in");
  },

  signIn(req, res, next){
    //console.log("signing in USER");

    passport.authenticate("local", function(err, user, info) {
      if(err){
        return next(err);
      }
      if(!user){
        req.flash("notice", info.message);
        return res.redirect("/users/sign_in");
      }
      req.flash("notice", "Login Success!");
      req.logIn(user, function(err){
        if(err){ return next(err); }
        return res.redirect("/");
      });
    })(req, res, next);

    // passport.authenticate("local")(req, res, function(){
    //   if(!req.user){
    //     console.log("wrong");
    //     req.flash("notice", "Sign in failed. Please try again.");
    //     res.redirect("/users/sign_in");
    //   } else {
    //     req.flash("notice", "You've successfully signed in!");
    //     res.redirect("/");
    //   }
    // })
  },

  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },
}
