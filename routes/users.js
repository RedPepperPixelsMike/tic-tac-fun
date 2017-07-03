
let {User} = require('./../models/user');
let {authenticate} = require('./../middleware/authenticate');
let express = require('express');
let router = express.Router();
const _ = require('lodash');


router.post('/', async (req, res) => {
        console.log('Got in here');
    try {
        console.log('Got in here 1');
        const body = _.pick(req.body, ['email', 'password']);
        console.log('Got in here 2');
        const user = new User(body);
        console.log('Got in here 3');
        console.log(process.env.MONGODB_URI);
        await user.save();
        console.log('Got in here 4');
        const token = await user.generateAuthTokens();
        console.log('Got in here 5');
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }

});

router.get('/me', authenticate, (req, res) => {
    res.send(req.user);
});

router.post('/login', async (req, res) => {

    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthTokens();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send();
    }

});

router.delete('/me/token', authenticate, async (req, res) => {

    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send();
    }

});

module.exports = router;
