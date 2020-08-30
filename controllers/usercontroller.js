const router = require('express').Router();
const User = require('../db').import('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

router.post('/register', function(req, res) {
    User.create({
        username: req.body.username,
        passwordhash: bcrypt.hashSync(req.body.password, 10)
    })
    .then(
        function createSuccess(user) {
            let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1d'});
            res.json({
                user: user,
                message: "Account successfully created!",
                sessionToken: token
            });
        }
    )
    .catch(err => res.status(500).json({error: err}))
});

module.exports = router;