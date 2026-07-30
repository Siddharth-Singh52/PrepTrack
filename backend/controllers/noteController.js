const Note = require("../models/note");

const createNote = async (req, res) => {

    const{ title, content } = req.body;

    if(!title || !content) {
        return res.status(400).json({ 
            message: "Please provide both title and content for the note."
        });
    }

    const note = await Note.create({
        title,
        content,
        user: req.user._id
    })

    res.status(201).json({
        message: "Note created successfully",
        note
    });
};

const getNotes = async (req, res) => {

    const notes = await Note.find({
        user: req.user._id
    });

    res.status(200).json({
        message: "Notes retrieved successfully",
        notes
    });
};

const getSingleNote = async (req, res) => {

    const note = await Note.findById(req.params.id);

    if(!note) {
        return res.status(404).json({
            message: "Note not found"
        });
    }

    // Check if the note belongs to the authenticated user
    if(note.user.toString() !== req.user._id.toString()){
        return res.status(403).json({
            message: "You are not authorized to view this note"
        });
    }

    return res.status(200).json({
        message: "Note retrieved successfully",
        note
    });
}

const updateNote = async (req, res) => {

    const { title, content } = req.body;

    const note = await Note.findById(req.params.id);

    if(!note) {
        return res.status(404).json({
            message: "Note not found"
        });
    }

    // Check if the note belongs to the authenticated user
    if(note.user.toString() !== req.user._id.toString()){
        return res.status(403).json({
            message: "You are not authorized to update this note"
        });
    }

    // Update the note
    note.title = title || note.title;
    note.content = content || note.content;

    await note.save();

    res.status(200).json({
        message: "Note updated successfully",
        note
    });
};

const deleteNote = async (req, res) => {

    const note = await Note.findById(req.params.id);

    if(!note) {
        return res.status(404).json({
            message: "Note not found"
        });
    }

    // Check if the note belongs to the authenticated user
    if(note.user.toString() !== req.user._id.toString()){
        return res.status(403).json({
            message: "You are not authorized to delete this note"
        });
    }

    await note.deleteOne();

    res.status(200).json({
        message: "Note deleted successfully"
    });
}

module.exports = {
    createNote,
    getNotes,
    getSingleNote,
    updateNote,
    deleteNote
};