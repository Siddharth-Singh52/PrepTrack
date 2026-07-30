const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    content: {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // ref tells Mongoose which collection this ObjectId belongs to.
        required: true
    },
},

{
    timestamps: true
});

module.exports = mongoose.model("note", noteSchema);