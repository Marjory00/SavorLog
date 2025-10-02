
// models/Recipe.js
const mongoose = require('mongoose');

// --- Nested Schema for Ingredients ---
const IngredientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: String,
        required: true
    }
    // Note: You could expand this with an 'unit' field later
});

// --- Main Recipe Schema ---
const RecipeSchema = mongoose.Schema({
    // User who created the recipe (optional for now, but good for future auth)
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: [IngredientSchema], // Array of nested Ingredient objects
    
    instructions: {
        type: [String], // An array of strings, where each string is a step
        required: true
    },
    
    // Key metadata fields
    prepTime: { type: Number, default: 0 }, // In minutes
    cookTime: { type: Number, default: 0 }, // In minutes
    servings: { type: Number, default: 1 },
    cuisine: { type: String, trim: true, default: 'General' },
    
    // Tags for filtering (e.g., 'Vegetarian', 'Quick', 'Dinner')
    tags: {
        type: [String],
        default: []
    },
    
    // Basic rating system (for future updates)
    rating: { type: Number, default: 0, min: 0, max: 5 },
    
    // Image URL (we won't implement actual upload yet, just storage)
    imageUrl: { type: String, default: '' },

}, {
    // Automatically adds 'createdAt' and 'updatedAt' timestamps
    timestamps: true 
});

module.exports = mongoose.model('Recipe', RecipeSchema);
