// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();

// --- Middleware Setup ---
// 1. CORS: Allows our frontend (on a different port) to access the API
app.use(cors());

// 2. JSON Parser: Allows the server to read JSON data sent in the request body
app.use(express.json());


// --- Database Connection ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully.');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        // Exit process with failure
        process.exit(1);
    }
};

connectDB();


// --- Routes Setup ---
// Import and use the recipe routes
const recipeRoutes = require('./routes/recipeRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes'); 
app.use('/api/recipes', recipeRoutes);
app.use('/api/plan', mealPlanRoutes);

// Simple test route
app.get('/', (req, res) => {
    res.send('SavorLog API is running...');
});


// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));