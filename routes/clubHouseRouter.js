const { Router } = require('express');
const { getHomePage, deleteMessage, getSignUp, postSignUp, getLogIn, postLogIn, logOutUser, getMembership, postMembership, getAdmin, postAdmin, getNewMsg, postNewMsg } = require('../controller/clubHouseController');
const passport = require('passport');
const { isAuth } = require('../middleware/authMiddleware');
const clubHouseRouter = Router();

clubHouseRouter.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})

clubHouseRouter.get('/', getHomePage);
clubHouseRouter.get('/signup', getSignUp);
clubHouseRouter.post('/signup', postSignUp);
clubHouseRouter.get('/login', getLogIn);
clubHouseRouter.post('/login', postLogIn);
clubHouseRouter.get('/logout', logOutUser);
clubHouseRouter.get('/membership', isAuth, getMembership);
clubHouseRouter.post('/membership', isAuth, postMembership);
clubHouseRouter.get('/admin', isAuth, getAdmin);
clubHouseRouter.post('/admin', isAuth, postAdmin);
clubHouseRouter.delete('/:id', isAuth, deleteMessage)
clubHouseRouter.get('/newmsg', getNewMsg);
clubHouseRouter.post('/newmsg', isAuth, postNewMsg);

module.exports = clubHouseRouter;