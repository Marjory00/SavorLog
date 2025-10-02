// savorlog-backend/models/Recipe.js (FIXED to match frontend structure)

const mongoose = require('mongoose');

// --- Main Recipe Schema (Simplified) ---
const RecipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true, // Removes whitespace from both ends of a string
        // Note: Removed 'unique: true' to allow recipes with the same name if needed.
    },
    
    // FIX: Changed from nested array [IngredientSchema] to a simple string
    // The frontend sends ingredients as a comma-separated string.
    ingredients: {
        type: String, 
        required: true,
    },
    
    // FIX: Changed from array of strings [String] to a single string
    // The frontend sends instructions as a single block of text.
    instructions: {
        type: String, 
        required: true
    },
    
    // Key metadata fields
    // FIX: We only captured prepTime in the frontend form
    prepTime: { 
        type: Number, 
        required: true, // Mark as required since the frontend form always sends it
        default: 30 
    }, 
    cuisine: { 
        type: String, 
        trim: true, 
        default: 'American' // Default matches the frontend form default
    },
    
    // Metadata we are NOT currently using in the frontend, but keeping for reference:
    /*
    cookTime: { type: Number, default: 0 },
    servings: { type: Number, default: 1 },
    tags: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    imageUrl: { type: String, default: '' },
    */

}, {
    // Automatically adds 'createdAt' and 'updatedAt' timestamps
    timestamps: true 
});

module.exports = mongoose.model('Recipe', RecipeSchema);