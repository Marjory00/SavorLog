// savorlog-backend/routes/recipes.js

const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const mongoose = require('mongoose');

// ----------------------------------------------------
// --- 1. CREATE a new Recipe (POST /api/recipes) ---
// ----------------------------------------------------
router.post('/', async (req, res) => {
    try {
        const newRecipe = new Recipe(req.body); 
        const recipe = await newRecipe.save();
        
        // Success: 201 Created
        res.status(201).json(recipe); 
    } catch (err) {
        // Handle Mongoose Validation Errors (e.g., missing required fields)
        if (err.name === 'ValidationError') {
            console.error('Mongoose Validation Error:', err.message); 
            return res.status(400).json({ 
                message: 'Validation failed. Check required fields.', 
                error: err.message 
            });
        }
        
        // Handle other server/database errors
        console.error('Server Error during POST:', err.message);
        res.status(500).json({ 
            message: 'Server error during recipe creation.', 
            error: err.message 
        });
    }
});

// --------------------------------------------------
// --- 2. READ all Recipes (GET /api/recipes) ---
// --------------------------------------------------
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find().sort({ createdAt: -1 });
        res.json(recipes);
    } catch (err) {
        console.error('Error fetching recipes:', err.message);
        res.status(500).json({ 
            message: 'Error fetching recipes.', 
            error: err.message 
        });
    }
});

// ---------------------------------------------------
// --- 3. READ single Recipe (GET /api/recipes/:id) ---
// ---------------------------------------------------
router.get('/:id', async (req, res) => {
    try {
        // Validate the ID format early
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Recipe ID format.' });
        }

        const recipe = await Recipe.findById(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }
        
        res.json(recipe);
    } catch (err) {
        // Handle unexpected errors during the findById operation
        console.error('Error fetching recipe by ID:', err.message);
        res.status(500).json({ 
            message: 'Error fetching recipe.', 
            error: err.message 
        });
    }
});


// ---------------------------------------------------
// --- 4. UPDATE a Recipe (PUT /api/recipes/:id) ---
// ---------------------------------------------------
router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Recipe ID format.' });
        }

        const recipe = await Recipe.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            // { new: true } returns the updated document, { runValidators: true } ensures schema validation is performed
            { new: true, runValidators: true } 
        );

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        res.json(recipe);
    } catch (err) {
        // Handle Mongoose Validation Errors during update
        if (err.name === 'ValidationError') {
             return res.status(400).json({ 
                message: 'Validation failed during update.', 
                error: err.message 
            });
        }
        console.error('Server Error during update:', err.message);
        res.status(500).json({ 
            message: 'Failed to update recipe.', 
            error: err.message 
        });
    }
});

// ---------------------------------------------------
// --- 5. DELETE a Recipe (DELETE /api/recipes/:id) ---
// ---------------------------------------------------
router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Recipe ID format.' });
        }

        const recipe = await Recipe.findByIdAndDelete(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        res.json({ message: 'Recipe removed successfully.' }); 
    } catch (err) {
        console.error('Server Error during delete:', err.message);
        res.status(500).json({ 
            message: 'Failed to delete recipe.', 
            error: err.message 
        });
    }
});

module.exports = router;