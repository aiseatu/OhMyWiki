const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");
const stripe = require("stripe")("sk_test_0j1EiD9Ng2odOvURk1eAzM9700ButAdE2R");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
        //console.log("ERROR:", err);
        req.flash("error", [{ location: 'body', param: 'email', msg: err }]);
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
    console.log("signing in USER");

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

  upgradeForm(req, res, next){
    res.render("users/upgrade");
  },

  upgrade(req, res, next){
    const token = req.body.stripeToken;
    const charge = stripe.charges.create({
      amount: 1500,
      currency: 'usd',
      description: 'Account upgrade to premium',
      source: token
    });
    userQueries.upgrade(req, (err, user) => {
      if(err){
        req.flash("error", err);
        res.redirect("/users/upgrade");
      } else {
        req.flash("notice", "You have been upgraded");
        res.redirect("/");
      }
    })
  },

  downgradeForm(req, res, next){
    res.render("users/downgrade");
  },

  downgrade(req, res, next){
    userQueries.downgrade(req, (err, user) => {
      if(err){
        req.flash("error", err);
        res.redirect("/users/downgrade");
      } else {
        req.flash("notice", "You have been downgraded");
        res.redirect("/");
      }
    });
    wikiQueries.downgradeWikis(req, (err, wikis) => {
      if(err){
        req.flash("errors", err);
        res.redirect("/users/downgrade");
      } else {
        req.flash("notice", "Your private Wikis have been downgraded");
      }
    });
  }
}
