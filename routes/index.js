const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    const params = { title: 'Books Directory' };
    if(req.session.user)
        params.authenticated = req.session.user;

    console.log(params);
    
    res.render('index', params);
});

module.exports = router;
