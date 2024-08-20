const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js')
const oauth = require('./middleware/oauth.js')

const app = express();

dotenv.config();
app.use(express.json());
connectDb();


app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth/", authRoutes);

app.use(session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.use(passport.initialize())
app.use(passport.session())


app.get("/", (req, res) => {
    return res.send('<a href="/auth/google">Authenticate with google</a>')
});


app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google' }),
    function (req, res) {

        res.redirect('/api/v1/users');
    });


const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
