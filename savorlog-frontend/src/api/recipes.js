// savorlog-frontend/src/api/api.js (FIXED and Robust with Axios)

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper function to handle common API errors and throw meaningful messages
const handleApiError = (error, defaultMessage) => {
    // Axios errors have a response object if the server replied with a status code (like 400 or 500)
    if (error.response) {
        // The backend validation error message is typically in error.response.data.message
        const serverMessage = error.response.data.message || error.response.data.error;
        throw new Error(serverMessage || defaultMessage);
    } 
    // Handle network errors (e.g., server is down)
    throw new Error('Network Error: The backend server might be down or unreachable.');
};


// ------------------------------------
// --- RECIPE CRUD ---
// ------------------------------------

export const getAllRecipes = async () => {
    try {
        const response = await api.get('/recipes');
        return response.data;
    } catch (error) {
        throw handleApiError(error, 'Failed to fetch all recipes.');
    }
};

export const createRecipe = async (recipeData) => {
    try {
        const response = await api.post('/recipes', recipeData);
        // Axios wraps the response data in the 'data' property
        return response.data;
    } catch (error) {
        throw handleApiError(error, 'Failed to create the new recipe.');
    }
};

// ... (Add get, update, delete recipe functions here later)


// ------------------------------------
// --- MEAL PLAN CRUD ---
// ------------------------------------

// Read: Fetch all scheduled meals
export const getMealPlan = async () => {
    try {
        // FIX: Corrected path from '/plan' to '/mealplan' to match server.js
        const response = await api.get('/mealplan'); 
        return response.data;
    } catch (error) {
        throw handleApiError(error, 'Failed to fetch meal plan.');
    }
};

// Create: Schedule a new meal
export const scheduleMeal = async (planData) => {
    try {
        // FIX: Corrected path from '/plan' to '/mealplan' to match server.js
        const response = await api.post('/mealplan', planData); 
        return response.data; 
    } catch (error) {
        throw handleApiError(error, 'Failed to schedule the meal.');
    }
};

// Delete: Remove a meal plan entry
export const unscheduleMeal = async (planId) => {
    try {
        // FIX: Corrected path from '/plan' to '/mealplan' to match server.js
        const response = await api.delete(`/mealplan/${planId}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error, 'Failed to unschedule the meal.');
    }
};

// Export the base URL in case it's needed elsewhere
export default API_BASE_URL;