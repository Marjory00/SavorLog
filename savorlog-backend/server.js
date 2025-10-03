// savorlog-backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file (e.g., MONGO_URI, PORT)
dotenv.config();

const app = express();

// ---------------------------
// --- Middleware Setup ---
// ---------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// ---------------------------------
// --- Database Connection ---
// ---------------------------------

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); 
        console.log(' MongoDB connected successfully.');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

connectDB();


// ---------------------------------
// --- Routes Setup ---
// ---------------------------------

// Helper function to handle module not found errors gracefully during route loading
const requireRoute = (path) => {
    try {
        return require(path);
    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            console.error(`\n CRITICAL ERROR: Route file not found at ${path}.`);
            console.error(`Please ensure the file exists and is named correctly (e.g., './routes/recipes.js').`);
            process.exit(1);
        }
        throw err; // Re-throw any other error
    }
};

// Import route files using the helper function
const recipeRoutes = requireRoute('./routes/recipes');      
const mealPlanRoutes = requireRoute('./routes/mealplan'); 

// Map imported routes to their base API endpoints
app.use('/api/recipes', recipeRoutes);
app.use('/api/mealplan', mealPlanRoutes); 

// Simple test route for the root URL
app.get('/', (req, res) => {
    res.json({ message: 'SavorLog API is running' });
});


// ---------------------------
// --- Server Start ---
// ---------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server listening on port ${PORT}`));