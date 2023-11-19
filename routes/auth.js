const express = require('express');
const User = require("../models/User");
const { query, body, matchedData, validationResult } = require('express-validator');

const router = express.Router();

router.post('/createuser',body('name','Enter valid Name').isLength({min:3}),
            body('email','Enter valid Email').isEmail(),
            body('password','Enter valid password').isLength({min:5})
            ,async (req,res)=>{
    const errors = validationResult(req);
    // if validation errors are found then it goes inside IF returns error message in response
    if (!errors.isEmpty()) {
        // const user = User(req.body);
        // user.save()
        return res.send({ errors: errors.array() });
    }
    // if no errors then proceeds to create register the data into user DB
    try {
        const user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        res.json(user);
        } 
    catch (error) 
        {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
        } 
})

module.exports = router;