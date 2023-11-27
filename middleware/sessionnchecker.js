const express = require('express');
const session = require('express-session');

var sessionChecker = (req, res, next) => {    
    console.log("Session Checker");
    console.log(req.session);
    if (req.session) {
        console.log("Found User Session");
        next();
    } else {
        console.log("No User Session Found");
        res.redirect('/loginuser');
    }
};

module.exports = sessionChecker;