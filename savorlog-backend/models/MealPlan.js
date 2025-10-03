// models/MealPlan.js (Already Correct)

const mongoose = require('mongoose');

// It's common Mongoose practice to define the Schema object and then register it.
const MealPlanSchema = new mongoose.Schema({ // Use 'new mongoose.Schema' for consistency
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

// The model registration is correct.
module.exports = mongoose.model('MealPlan', MealPlanSchema);