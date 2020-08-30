const router = require('express').Router();
const Log = require("../db").import('../models/log');
const validateSession = require('../middleware/validate-session');

router.post('/', validateSession, (req, res) => {
    const logEntry = {
        description: req.body.description,
        definition: req.body.definition,
        result: req.body.result,
        owner_id: req.user.id
    }
    Log.create(logEntry)
    .then(log => res.status(200).json(log))
    .catch(err => res.status(500).json({error: err}))
});

router.get('/', validateSession, (req, res) => {
    let userid = req.user.id
    Log.findAll({
        where: { owner_id: userid}
    })
    .then(logs => res.status(200).json(logs))
    .catch(err => res.status(500).json({error: err}))
})

router.get('/:id', validateSession, (req, res) => {
    let userid = req.user.id
    Log.findOne({
        where: {owner_id: userid, id: req.params.id}
    })
    .then(log => res.status(200).json(log))
    .catch(err => res.status(500).json({error: err}))
})

router.put('/:id', validateSession, (req, res) => {
    let userid = req.user.id
    Log.update(req.body, { where: {owner_id: userid, id: req.params.id}})
    .then(log => res.status(200).json({
        log: log,
        message: `${log.description} was updated!`
    }))
    .catch(err => res.status(500).json({error: err}))
})

module.exports = router;