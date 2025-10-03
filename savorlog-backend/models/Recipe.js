// savorlog-backend/models/Recipe.js (Minor Enhancement)

const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required for the recipe.'], 
        trim: true 
    },
    cuisine: {
        type: String,
        default: 'General'
    },
    ingredients: {
        // ENHANCEMENT: Changed from String to [String] to store a list of ingredients
        type: [String], 
        required: [true, 'Ingredients list is required.'],
        // Adding minlength validation to ensure at least one ingredient is present (optional)
        // minlength: [1, 'The recipe must have at least one ingredient.'],
    },
    instructions: {
        type: String,
        required: [true, 'Instructions are required.'],
    },
    prepTime: {
        type: Number,
        required: [true, 'Preparation time is required.'],
        min: [1, 'Preparation time must be at least 1 minute.']
    },
}, {
    timestamps: true 
});

module.exports = mongoose.model('Recipe', RecipeSchema);