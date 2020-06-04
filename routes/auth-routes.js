const passport = require('passport');
const User = require('../passport-models');
const jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
// const checkAuth = require('../isAuthenticated');

router.post('/loginUser', 
  passport.authenticate('local'),
  async (req, res, next) => {
    await User.findOne({ username: req.user.username});
    const token = jwt.sign({ id: req.user.username }, 'secret');
    res.status(200).send({
      auth: true,
      token: token,
      message: 'user found & logged in',
    });

});


router.get('/findUser',
  passport.authenticate('jwt', { session: false }), 
  (req, res, next) => {
      res.status(200).send({
        auth: true,
        username: req.user.username,
        password: req.user.password,
        emailAddress: req.user.emailAddress,
      });
});


router.post("/register", (req, res, next) => {
    const { username, password } = req.body;
    User.create({ username, password })
      .then(user => {
        req.login(user, err => {
          if (err) next(err);
          else res.redirect("/");
        });
      })
      .catch(err => {
        if (err.name === "ValidationError") {
          req.flash("Sorry, that username is already taken.");
          res.redirect("/register");
        } else next(err);
      });
  });

router.post("/update-email",
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    //search by id, update email
      const result = await User.findByIdAndUpdate(req.user._id, 
        //update
        {emailAddress: req.body.emailAddress,},
        //options
        {
        useFindAndModify: false,
        new: true,
        }
      );

      res.send({
        username: result.username,
        emailAddress: result.emailAddress,
        message: 'Successfully updated email'
      });
})

module.exports = router;