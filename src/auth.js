const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const config = require("./config");

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
};

passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        if (jwt_payload) {
            done(null, jwt_payload);
        } else {
            done(null, false);
        }
    })
);

const authMiddleware = passport.authenticate("jwt", { session: false });

module.exports = authMiddleware;
