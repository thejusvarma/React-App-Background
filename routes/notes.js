const express = require('express');
const router = express.Router();
const sessionChecker = require('../middleware/sessionnchecker');
const notes = require('../models/Notes');
const fetchuser = require('../middleware/fetchuser');

// router.get('/', sessionChecker, async function(req, res, next) {
//     res.json({message:"error reaching"})    
// });

//fetching all notes using GET "api/notes/fetchallnotes"
router.get('/fetchallnotes',fetchuser,async (req,res)=>
{
     const Notes = await notes.find({user:req.user.id})
     console.log(Notes);
     res.json(Notes)
})

//add notes using POST "api/notes/addnotes"
// router.post('/adduser',fetchuser,[] async(req,res)=>
// {
    
// })

module.exports = router;
