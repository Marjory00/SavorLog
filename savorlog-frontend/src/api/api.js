// savorlog-frontend/src/api/api.js

// IMPORTANT: This must match the port and path defined in savorlog-backend/server.js
const BASE_URL = 'http://localhost:5000/api'; 

// ------------------------------------
// --- Recipe Endpoints ---
// ------------------------------------

// POST: Create a new recipe
export const createRecipe = async (recipeData) => {
    try {
        const response = await fetch(`${BASE_URL}/recipes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipeData),
        });

        if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(errorData.message || 'Failed to create recipe on the server.');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error in createRecipe:', error);
        throw error;
    }
};

// GET: Fetch all recipes
export const fetchRecipes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/recipes`);

        if (!response.ok) {
            throw new Error('Failed to fetch recipes from API.');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error in fetchRecipes:', error);
        throw error;
    }
};

/**
 * Deletes a recipe by ID.
 * @param {string} id - The ID of the recipe to delete.
 */
export const deleteRecipe = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/recipes/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete recipe.');
        }

        return true; 
    } catch (error) {
        console.error('API Error in deleteRecipe:', error);
        throw error;
    }
};

/**
 * Updates an existing recipe by ID. NEW FUNCTION ADDED HERE
 * @param {string} id - The ID of the recipe to update.
 * @param {object} recipeData - The new data for the recipe.
 */
export const updateRecipe = async (id, recipeData) => {
    try {
        const response = await fetch(`${BASE_URL}/recipes/${id}`, {
            method: 'PUT', // Standard RESTful method for updating a resource
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipeData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update recipe on the server.');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error in updateRecipe:', error);
        throw error;
    }
};


// ------------------------------------
// --- Meal Plan Endpoints ---
// ------------------------------------

/**
 * Fetches all scheduled meal plan entries.
 */
export const getMealPlan = async () => {
    try {
        const response = await fetch(`${BASE_URL}/mealplan`);

        if (!response.ok) {
            throw new Error('Failed to fetch meal plans.');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error in getMealPlan:', error);
        throw error;
    }
};

/**
 * Creates a new meal plan entry.
 */
export const scheduleMeal = async (planData) => {
    try {
        const response = await fetch(`${BASE_URL}/mealplan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(planData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to schedule meal.');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error in scheduleMeal:', error);
        throw error;
    }
};

/**
 * Deletes a meal plan entry by ID.
 */
export const unscheduleMeal = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/mealplan/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete meal plan entry.');
        }

        return true; 
    } catch (error) {
        console.error('API Error in unscheduleMeal:', error);
        throw error;
    }
};


/**
 * @name updateScheduledMeal
 * @description Updates an existing meal plan entry (used for dragging/moving meals).
 * @param {string} id - The ID of the meal plan entry to update.
 * @param {object} updateData - Contains fields like { scheduledDate: '2025-10-02T18:00:00.000Z' }
 * @returns {object} The updated meal plan entry.
 */
export const updateScheduledMeal = async (id, updateData) => {
    try {
        const response = await fetch(`${BASE_URL}/mealplan/${id}`, {
            method: 'PUT', // Use PUT or PATCH for updates
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update scheduled meal time.');
        }

        return await response.json(); 
    } catch (error) {
        console.error(`API Error in updateScheduledMeal (${id}):`, error);
        throw error;
    }
};


// Export the base URL in case it's needed elsewhere
export default BASE_URL;