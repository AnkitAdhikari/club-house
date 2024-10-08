const express = require("express");
require('dotenv').config();
const methodOverride = require('method-override');
const app = express();
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pool = require('./database/pool');
const pgSession = require('connect-pg-simple')(session);
const PORT = process.env.PORT;
const path = require("node:path");
const clubHouseRouter = require("./routes/clubHouseRouter");


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'user_sessions'
    }), secret: process.env.session_secret, resave: false, saveUninitialized: false, cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
            const user = rows[0];

            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            if (bcrypt.compareSync(user.password, password)) {
                return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const user = rows[0];

        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.use('/', clubHouseRouter);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})