const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../passport-models');

const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: 'secret',
};

// ?
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

// ?
passport.deserializeUser(function(userId, done) {
    User.findById(userId, (err, user) => done(err, user));
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username })
        .then(user => {
            if (!user || !user.validPassword(password)) {
                done(null, false, { message: "Invalid username/password" });
            } else {
                done(null, user);
            }
        })
        .catch(err => done(err));
    }
))

passport.use(
    new JWTStrategy(opts, (jwt_payload, done) => {
        try {
          User.findOne({username: jwt_payload.id,})
          .then(user => {
            if (user) {
              console.log('user found in db in passport');
              done(null, user);
            } else {
              console.log('user not found in db');
              done(null, false);
            }
          });
        } catch (err) {
          done(err);
        }
      }),
);