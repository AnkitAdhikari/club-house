const passport = require("passport");
const { getMessages, deleteMessageById, updateMembershipStatus, updateAdminStatus } = require("../database/query");

async function getHomePage(req, res) {

    const messages = await getMessages();
    res.render('home', { messages, pageTitle: "Home", user: req.user });
}

async function getSignUp(req, res) {
    res.render('signup', { pageTitle: 'Sign Up' });
}

async function postSignUp(req, res) {
    console.log(req.body);
    res.send(req.body);
}

async function getLogIn(req, res) {
    res.render('login', { pageTitle: "Log In" });
}

const postLogIn = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
});

async function logOutUser(req, res) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
}

async function getMembership(req, res) {
    res.render('membership', { pageTitle: "Membership" });
}

async function postMembership(req, res) {
    try {

        const { memcode } = req.body
        const userId = req.user.id;
        if (memcode === "member123") {
            await updateMembershipStatus(userId);
            res.redirect('/');
        } else {
            throw new Error("Invalid membership code");
        }
    } catch (err) {
        throw new Error(err);
    }
}
async function getAdmin(req, res) {
    res.render('admin', { pageTitle: "Admin" });
}

async function postAdmin(req, res) {
    try {

        const { admincode } = req.body
        const userId = req.user.id;
        if (admincode === "admin123") {
            await updateAdminStatus(userId);
            res.redirect('/');
        } else {
            throw new Error("Invalid admin code");
        }
    } catch (err) {
        throw new Error(err);
    }
}



async function deleteMessage(req, res) {
    const { id: messageId } = req.params;
    const isDeleted = await deleteMessageById(messageId);
    if (isDeleted) {
        res.redirect('/');
    } else {
        res.send("<p class='error'>message not deleted return <a href='/'>home</a></p>")
    }
}

module.exports = { getHomePage, deleteMessage, getSignUp, postSignUp, getLogIn, postLogIn, logOutUser, getMembership, postMembership, postAdmin, getAdmin }