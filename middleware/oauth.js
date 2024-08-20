const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/model'); 
const dotenv = require('dotenv');

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback: true
},
async (request, accessToken, refreshToken, profile, done) => {
    try {
        console.log('User Profile:', profile);

        // Check if the user already exists in the database
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            // If user does not exist, create a new user
            user = await User.create({
                googleId: profile.id,
                email: profile.emails ? profile.emails[0].value : 'No email available',
                displayName: profile.displayName,
            });
        }

        // Pass the user object to `done`
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// Serialize user information into the session
passport.serializeUser((user, done) => {
    done(null, user.id); // Serialize just the user ID for simplicity
});

// Deserialize user information from the session
passport.deserializeUser(async (id, done) => {
    try {
        // Fetch user by ID
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
