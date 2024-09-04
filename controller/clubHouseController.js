const passport = require("passport");
const { getMessages, deleteMessageById, updateMembershipStatus, updateAdminStatus, insertNewMsg } = require("../database/query");

async function getHomePage(req, res) {

    const messages = await getMessages();
    res.render('home', { messages, pageTitle: "Home", });
}

async function getSignUp(req, res) {
    res.render('signup', { pageTitle: 'Sign Up' });
}

async function postSignUp(req, res) {
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

async function getNewMsg(req, res) {
    res.render('newmsg', { pageTitle: 'Create Message' });
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

async function postNewMsg(req, res) {
    const { title, message } = req.body;
    try {
        await insertNewMsg(req.user.id, title, message);
        res.redirect('/');
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { getHomePage, deleteMessage, getSignUp, postSignUp, getLogIn, postLogIn, logOutUser, getMembership, postMembership, postAdmin, getAdmin, getNewMsg, postNewMsg }