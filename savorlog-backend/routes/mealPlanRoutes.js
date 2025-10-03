
// routes/mealPlanRoutes.js
const express = require('express');
const router = express.Router();
const MealPlan = require('../models/MealPlan');
const mongoose = require('mongoose');

// --- 1. CREATE a new Meal Plan entry (POST /api/plan) ---
// Used when a recipe is drag-and-dropped onto the calendar
router.post('/', async (req, res) => {
    try {
        const { recipeId, scheduledDate, mealType } = req.body;
        
        // Basic validation for the recipe ID format
        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
            return res.status(400).json({ message: 'Invalid recipe ID.' });
        }
        
        const newPlan = new MealPlan({
            recipe: recipeId,
            scheduledDate,
            mealType: mealType || 'Dinner'
        });
        
        // Use .populate('recipe') to return the full recipe object with the plan
        const savedPlan = await newPlan.save();
        const populatedPlan = await savedPlan.populate('recipe');
        
        res.status(201).json(populatedPlan);
    } catch (err) {
        res.status(400).json({ 
            message: 'Failed to schedule meal.', 
            error: err.message 
        });
    }
});

// --- 2. READ all Meal Plan entries (GET /api/plan) ---
// This will fetch all scheduled meals, optionally filtered by date range later
router.get('/', async (req, res) => {
    try {
        // Fetch all meal plans, and crucially, populate the 'recipe' field
        const plans = await MealPlan.find()
            .populate('recipe')
            .sort({ scheduledDate: 1 });
            
        res.json(plans);
    } catch (err) {
        res.status(500).json({ 
            message: 'Error fetching meal plan.', 
            error: err.message 
        });
    }
});

// --- 3. DELETE a Meal Plan entry (DELETE /api/plan/:id) ---
// Used when a scheduled meal is removed from the calendar
router.delete('/:id', async (req, res) => {
    try {
        const deletedPlan = await MealPlan.findByIdAndDelete(req.params.id);
        
        if (!deletedPlan) {
            return res.status(404).json({ message: 'Meal plan entry not found.' });
        }

        res.json({ message: 'Meal plan entry removed successfully.' }); 
    } catch (err) {
        res.status(500).json({ 
            message: 'Failed to delete meal plan entry.', 
            error: err.message 
        });
    }
});

module.exports = router;