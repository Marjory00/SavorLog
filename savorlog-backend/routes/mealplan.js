// routes/mealplan.js (FIXED for better validation error reporting)

const express = require('express');
const router = express.Router();
const MealPlan = require('../models/MealPlan');
const mongoose = require('mongoose');

// -----------------------------------------------------------------
// --- 1. CREATE a new Meal Plan entry (POST /api/mealplan) ---
// -----------------------------------------------------------------
router.post('/', async (req, res) => {
    try {
        const { recipeId, scheduledDate, mealType } = req.body;
        
        // Basic validation for the recipe ID format
        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
            return res.status(400).json({ message: 'Invalid recipe ID format provided.' });
        }
        
        const newPlan = new MealPlan({
            recipe: recipeId,
            scheduledDate,
            mealType: mealType // Uses default from schema if undefined, or passed value
        });
        
        // Save the plan and then populate the recipe details to return a complete object
        const savedPlan = await newPlan.save();
        // NOTE: We await the save, then use populate on the result to get the data
        const populatedPlan = await savedPlan.populate('recipe');
        
        res.status(201).json(populatedPlan);
    } catch (err) {
        // FIX: Explicitly handle Mongoose Validation Errors for required fields (scheduledDate)
        if (err.name === 'ValidationError') {
            console.error('Mongoose Validation Error:', err.message); 
            return res.status(400).json({ 
                message: 'Validation failed. Check required fields (recipe, scheduledDate).', 
                error: err.message
            });
        }
        
        console.error('Server Error during POST:', err.message);
        res.status(500).json({ 
            message: 'Server error during meal scheduling.', 
            error: err.message 
        });
    }
});

// ----------------------------------------------------------------
// --- 2. READ all Meal Plan entries (GET /api/mealplan) ---
// ----------------------------------------------------------------
router.get('/', async (req, res) => {
    try {
        // Fetch all meal plans, and crucially, populate the 'recipe' field
        const plans = await MealPlan.find()
            .populate('recipe')
            .sort({ scheduledDate: 1 }); // Sort by date ascending
            
        res.json(plans);
    } catch (err) {
        console.error('Error fetching meal plan:', err.message);
        res.status(500).json({ 
            message: 'Error fetching meal plan.', 
            error: err.message 
        });
    }
});

// ----------------------------------------------------------------------
// --- 3. DELETE a Meal Plan entry (DELETE /api/mealplan/:id) ---
// ----------------------------------------------------------------------
router.delete('/:id', async (req, res) => {
    try {
        // FIX: Check for invalid ID format before querying
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Meal Plan ID format.' });
        }
        
        const deletedPlan = await MealPlan.findByIdAndDelete(req.params.id);
        
        if (!deletedPlan) {
            return res.status(404).json({ message: 'Meal plan entry not found.' });
        }

        // 200 OK is fine for deletion, 204 No Content is also an option
        res.json({ message: 'Meal plan entry removed successfully.' }); 
    } catch (err) {
        console.error('Server Error during DELETE:', err.message);
        res.status(500).json({ 
            message: 'Failed to delete meal plan entry.', 
            error: err.message 
        });
    }
});

module.exports = router;