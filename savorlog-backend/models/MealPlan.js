
// models/MealPlan.js
const mongoose = require('mongoose');

const MealPlanSchema = mongoose.Schema({
    // Link to the Recipe model using its ObjectId
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe', // References the 'Recipe' model
        required: true
    },
    
    // The specific date and time for the meal (Crucial for the planner)
    scheduledDate: {
        type: Date,
        required: true
    },
    
    // Optional field to categorize the meal (e.g., 'Breakfast', 'Lunch', 'Dinner')
    mealType: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Other'],
        default: 'Dinner'
    },
    
    // User who created the plan (future use for multi-user support)
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 

}, {
    timestamps: true
});

module.exports = mongoose.model('MealPlan', MealPlanSchema);