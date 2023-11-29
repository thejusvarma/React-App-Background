const express = require('express');
const router = express.Router();
const sessionChecker = require('../middleware/sessionnchecker');
const notes = require('../models/Notes');
const fetchuser = require('../middleware/fetchuser');
const { query, body, matchedData, validationResult } = require('express-validator');
const Note = require('../models/Notes');

// router.get('/', sessionChecker, async function(req, res, next) {
//     res.json({message:"error reaching"})    
// });

//fetching all notes using GET "api/notes/fetchallnotes"
router.get('/fetchallnotes',fetchuser,async (req,res)=>
{
    try
    {
        const Notes = await notes.find({user:req.user.id})
        console.log(Notes);
        res.json(Notes)
    }
    catch(err)
    {
        console.error(error.message);
        res.status(500).send("DB Error");
    }
})

//add notes using POST "api/notes/addnotes"
router.post('/addnote',body('title','Title should be minimum of 3 characters').isLength({min:3}),
                        body('content','Content should be of atleast 5 characters').isLength({min:5}),
        fetchuser, async(req,res)=>
{
    try
    {
        const { title, content, tag } = req.body;
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, content, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send("DB Error"); 
    }
})

// Route 3 updating the existing note "api/notes/updatenote"
router.put('/updatenote/:id',body('title','Title should be minimum of 3 characters').isLength({min:3}),
                        body('content','Content should be of atleast 5 characters').isLength({min:5}),
        fetchuser, async(req,res)=>
{
    const { title, content, tag } = req.body;
    try {
        // Create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (content) { newNote.content = content };
        if (tag) { newNote.tag = tag };

        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Route 3 updating the existing note "api/notes/updatenote"
router.delete('/deletenote/:id',
        fetchuser, async(req,res)=>
{

    try {
        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json("Deleted Successfully")
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;
