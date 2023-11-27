const express = require('express');
const User = require("../models/User");
const { query, body, matchedData, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const router = express.Router();
const session = require('express-session');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = 'Harryisagoodb$oy';


// ROUTE 1 : User account creation 
router.post('/createuser',body('name','Enter valid Name').isLength({min:3}),
            body('email','Enter valid Email').isEmail(),
            body('password','Enter valid password').isLength({min:5})
            ,async (req,res)=>{
    const errors = validationResult(req);
    // if validation errors are found then it goes inside IF returns error message in response
    if (!errors.isEmpty()) {

        return res.send({ errors: errors.array() });
    }
    // if no errors then proceeds to create register the data into user DB
    try {
        const saltRounds = 10;
        // creating hashed password using passwor + salt 
        const secpass = await bcrypt.hash(req.body.password, saltRounds)
        const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secpass 
                });
        const data = {
                user:{
                        id: user.id
                     }
                }
        const authtoken = jwt.sign(data, JWT_SECRET);      
                  // res.json(user)
        res.json({ authtoken});
        } 
    catch (error) 
        {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
        } 
})

// ROUTE 2 : User Login 
router.post('/loginuser',
            body('email','Enter valid Email').isEmail(),
            body('password','Password cannot be blank').exists()
            ,async (req,res)=>{
    let success = false;
    const errors = validationResult(req);
    // if validation errors are found then it goes inside IF returns error message in response
    if (!errors.isEmpty()) {
        return res.send({ errors: errors.array() });
    }
    const {email,password} = req.body;
    try{
        let user = await User.findOne({email});
        req.session.user = user;
        if(!user)
        {
            success = false;
            return res.status(400).json({error:"Please enter correct credentials"});
        }
        const comparepassword = await bcrypt.compare(password, user.password);
            if(comparepassword==false)
            {
                return res.status(400).json({error:"Please enter correct credentials"});
            }

    const data = {
                user: {
                  id: user.id
                }
              }
    const authtoken = jwt.sign(data, JWT_SECRET);
              success = true;
              res.json({ success, authtoken })
    res.json({status:"successfull"})
    }
    catch(error)
    {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
    } 
})

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {

    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })

module.exports = router;