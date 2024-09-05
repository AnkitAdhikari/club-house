const passport = require("passport");
const { getMessages, deleteMessageById, updateMembershipStatus, updateAdminStatus, insertNewMsg, insertUser, checkUserExistance } = require("../database/query");
const { body, validationResult } = require('express-validator');

const messageValidation = [
    body('title').trim().notEmpty().withMessage('title cannot be empty'),
    body('message').trim().notEmpty().withMessage('Message cannot be empty')
]

const signupValidation = [
    body('firstName').trim().notEmpty().withMessage("first name cannot be empty").isAlpha().withMessage("name can only be alphabets"),
    body('lastName').trim().notEmpty().withMessage('last name cannot be empty').isAlpha().withMessage('name can only be alphabets'),
    body('username').custom(async (value) => {
        let existingUser = await checkUserExistance(value);
        if (!existingUser) {
            throw new Error("username already in use");
        }
    }),
    body('password').custom((value) => {
        if (value[0].trim() !== value[1].trim()) throw new Error("both password must be same");
        if (value[0].trim() == '') throw new Error('password cannot be empty');
        if (value[0].length < 0) throw new Error('password too short');
    })
]

const bcrypt = require('bcrypt');

async function getHomePage(req, res) {

    const messages = await getMessages();
    res.render('home', { messages, pageTitle: "Home", });
}

async function getSignUp(req, res) {
    res.render('signup', { pageTitle: 'Sign Up' });
}

const postSignUp = [
    signupValidation,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('signup', { pageTitle: "SignUp", errors: errors.array(), });
        }
        const { firstName, lastName, username, password: [password] } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hashedPass = bcrypt.hashSync(password, salt);
        try {
            await insertUser(firstName, lastName, username, hashedPass);
            res.redirect('/');
        } catch (error) {
            throw new Error(error);
        }
    }
]

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

const postNewMsg = [
    messageValidation,
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('newmsg', { pageTitle: "New Message", errors: errors.array(), });
        }
        const { title, message } = req.body;
        try {
            await insertNewMsg(req.user.id, title, message);
            res.redirect('/');
        } catch (error) {
            throw new Error(error);
        }
    }
]

module.exports = { getHomePage, deleteMessage, getSignUp, postSignUp, getLogIn, postLogIn, logOutUser, getMembership, postMembership, postAdmin, getAdmin, getNewMsg, postNewMsg }