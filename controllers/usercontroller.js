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

router.post('/login', (req, res) => {
    User.findOne({ where: {username: req.body.username}})
    .then(
        user => {
            if(user){
                bcrypt.compare(req.body.password, user.passwordhash, (err, matches) => {
                    if(matches){
                        let token = jwt.sign({id: user.id, username: user.username},process.env.JWT_SECRET, {expiresIn: '1d'})
                        res.json({
                            user: user,
                            message: `Successfully authenticated ${user.username}`,
                            sessionToken: token
                        })
                    } else {
                        res.status(502).send({ error: 'bad gateway'})
                    }
                })
            } else {
                res.status(500).send({error: `A user with the name ${user.username} does not exist`})
            }
        },
        err => res.status(501).send({error: 'failed to process'})
    )
})

module.exports = router;