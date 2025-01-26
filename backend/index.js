require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');

mongoose.connect(config.connectionString);

const User = require('./models/user.model');
const Note = require('./models/note.model');

const express = require('express'); 
const cors = require('cors');
const app = express();

const jwt = require('jsonwebtoken');
const {authenticateToken} = require('./utilities');

app.use(express.json());

app.use(cors({
    origin: "*",
}));

app.get('/', (req, res) => {
    res.json({data: "Hello World"});
});

// ---------------------------------- ACCOUNT REALTED ROUTES

// Create Account
app.post('/create-account', async (req, res) => {
    const {fullName, email, password} = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({error: true, message: "Missing required information"});
    }

    const isUser = await User.findOne({email: email});
    if(isUser) {
        return res.status(400).json({error: true, message: "User already exists"});
    }

    const user = new User({
        fullName,
        email,
        password,
    })
    await user.save();

    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '36000m',

    });
    return res.json({
        error: false,
        user, 
        accessToken,
        message: "Account created successfully",
    })
});

//login

app.post('/login', async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({error: true, message: "Missing required information"});
    }

    const userInfo = await User.findOne({email: email});

    if(!userInfo) {
        return res.status(400).json({error: true, message: "User not found"});
    }

    if(userInfo.password === password && userInfo.email === email) {
        const user = {user: userInfo}
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '36000m',
        });

        return res.json({
            error: false,
            email,
            accessToken,
            message: "Login successful",
        });
    } else {
        return res.status(400).json({error: true, message: "Invalid credentials"});
    }
});

// Get User

app.get("/get-user", authenticateToken, async (req, res) => {

    const {user} = req.user
    
    const isUser =  await User.findOne({email : user.email})

    if(!isUser) {
        return res.sendStatus(401);
    }
    return res.json({
        error: false,
        user: {fullName: isUser.fullName, email: isUser.email, createdAt: isUser.createdAt, "_id": isUser._id},
        message: "User retrieved successfully",
    });

});


//------------------------------------ NOTES RELATED ROUTES

//add note
app.post("/add-note", authenticateToken, async (req, res) => {
    const {title, content, tags} = req.body;
    const {user} = req.user;

    if(!title || !content) {
        return res.status(400).json({error: true, message: "Missing required information"});
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });
        
        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        });
    } catch (error) {
        return res.status(500).json({error: true, message: "Error adding note"});
    }

    
});

//edit note

app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const {title, content, tags, isPinned} = req.body;
    const {user} = req.user;

    if(!title && !content && !tags) {
        return res.status(400).json({error: true, message: "No changes provided"});
    }
    try{
        const note = await Note.findOne({_id: noteId, userId: user._id});

        if(!note) {
            return res.status(404).json({error: true, message: "Note not found"});
        }
        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags = tags;
        if(isPinned) note.isPinned = isPinned;
        
        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note edited successfully",
        });

    } catch (error) {
        return res.status(500).json({error: true, message: "Error editing note"});
    }
});

// Get all notes

app.get("/get-all-notes", authenticateToken, async (req, res) => {
    const {user} = req.user;
    try {
        const notes = await Note.find({userId: user._id}).sort({isPinned: -1, createdAt: -1});

        return res.json({
            error: false,
            notes,
            message: "Notes retrieved successfully",
        });

    } catch (error) {
        return res.status(500).json({error: true, message: "Error retrieving notes"});
    }
    
});

//Delete note

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId
    const {user} = req.user;

    try {
        const note = await Note.findOne({_id: noteId, userId: user._id});

        if(!note) {
            return res.status(404).json({error: true, message: "Note not found"});
        }
        await note.deleteOne({_id: noteId, userId: user._id});  

        return res.json({
            error: false,
            message: "Note deleted successfully",
        });

    } catch (error){
        return res.status(500).json({error: true, message: "Error deleting note"});
    }
    
})

// Update isPinned

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const {isPinned} = req.body;
    const {user} = req.user;

    try{
        const note = await Note.findOne({_id: noteId, userId: user._id});

        if(!note) {
            return res.status(404).json({error: true, message: "Note not found"});
        }
        
        note.isPinned = isPinned || false;
        
        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });

    } catch (error) {
        return res.status(500).json({error: true, message: "Error updating note"});
    }
});

// Search notes
app.get("/search-notes", authenticateToken, async(req, res) => {
    const {user} = req.user;
    const {query} = req.query;
    if(!query) {
        return res.status(400).json({error: true, message: "Search query is required"});
    }
    try {
        const matchingNotes = await Note.find({userId: user._id, 
            $or:[
                {title: {$regex: query, $options: 'i'}},
                {content: {$regex: query, $options: 'i'}},
            ]});

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the query retrieved successfully",
        })
    } catch (error) {
        return res.status(500).json({error: true, message: "Error searching notes"});
    }
})

app.listen(8000);

module.exports = app;