
// routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const mongoose = require('mongoose');

// --- 1. CREATE a new Recipe (POST /api/recipes) ---
router.post('/', async (req, res) => {
    try {
        // Create a new recipe document using the data from the request body
        const newRecipe = new Recipe(req.body); 
        const recipe = await newRecipe.save();
        
        // Respond with the newly created recipe and a 201 status (Created)
        res.status(201).json(recipe); 
    } catch (err) {
        // Handle validation errors (e.g., missing 'title' or 'ingredients')
        res.status(400).json({ 
            message: 'Failed to create recipe.', 
            error: err.message 
        });
    }
});

// --- 2. READ all Recipes (GET /api/recipes) ---
router.get('/', async (req, res) => {
    try {
        // Fetch all recipes, sorting by the newest first
        const recipes = await Recipe.find().sort({ createdAt: -1 });
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ 
            message: 'Error fetching recipes.', 
            error: err.message 
        });
    }
});

// --- 3. READ a single Recipe by ID (GET /api/recipes/:id) ---
router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        const recipe = await Recipe.findById(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }
        
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ 
            message: 'Error fetching recipe.', 
            error: err.message 
        });
    }
});


// --- 4. UPDATE a Recipe by ID (PUT /api/recipes/:id) ---
router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        // Find the recipe by ID and update it with the request body data
        const recipe = await Recipe.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // { new: true } returns the updated document, { runValidators: true } ensures schema validation is performed
        );

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        res.json(recipe);
    } catch (err) {
        res.status(400).json({ 
            message: 'Failed to update recipe.', 
            error: err.message 
        });
    }
});

// --- 5. DELETE a Recipe by ID (DELETE /api/recipes/:id) ---
router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        const recipe = await Recipe.findByIdAndDelete(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found.' });
        }

        // Respond with a 200 status and a success message (No Content is also an option)
        res.json({ message: 'Recipe removed successfully.' }); 
    } catch (err) {
        res.status(500).json({ 
            message: 'Failed to delete recipe.', 
            error: err.message 
        });
    }
});

module.exports = router;