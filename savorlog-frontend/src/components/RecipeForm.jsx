// src/components/RecipeForm.jsx (FIXED: Moved initialFormState outside component)

import React, { useState, useEffect } from 'react';

import { createRecipe, updateRecipe as apiUpdateRecipe } from '../api/api'; 
import './RecipeForm.css'; // Assuming there is a CSS file for the form

// Define initialFormState OUTSIDE the component.
// This makes it a stable reference and resolves the linting warning.
const initialFormState = {
    title: '',
    cuisine: '',
    prepTime: '',
    ingredients: '',
    instructions: ''
};

// Destructure the new props from App.jsx
const RecipeForm = ({ 
    onRecipeCreated, 
    onRecipeUpdated, 
    onCancelEdit,
    recipeToEdit 
}) => {
    
    // Use the stable constant here
    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);

    // EFFECT: Load recipe data into the form when recipeToEdit changes
    // The dependency array now correctly only includes recipeToEdit.
    useEffect(() => {
        if (recipeToEdit) {
            // Map the recipe data to the form state
            setFormData({
                title: recipeToEdit.title || '',
                cuisine: recipeToEdit.cuisine || '',
                prepTime: recipeToEdit.prepTime || '',
                // Assuming ingredients/instructions might be arrays/objects and need string conversion
                ingredients: Array.isArray(recipeToEdit.ingredients) ? recipeToEdit.ingredients.join('\n') : recipeToEdit.ingredients || '',
                instructions: recipeToEdit.instructions || ''
            });
            setIsEditing(true);
        } else {
            setFormData(initialFormState); // Used here
            setIsEditing(false);
        }
        setFormError(null); // Clear any previous errors when state changes
    }, [recipeToEdit]); // Linting issue resolved!

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormError(null);

        // Simple validation check
        if (!formData.title || !formData.prepTime) {
            setFormError('Title and Preparation Time are required.');
            setLoading(false);
            return;
        }

        try {
            // Prepare data: split ingredients/instructions back into array/clean string if necessary
            const dataToSend = {
                ...formData,
                // Simple assumption: ingredients should be an array of strings for the backend
                ingredients: formData.ingredients.split('\n').filter(line => line.trim() !== ''),
                // Ensure prepTime is a number if your backend expects one
                prepTime: Number(formData.prepTime) || 0,
            };

            let result;

            if (isEditing) {
                // --- UPDATE (EDIT) LOGIC ---
                result = await apiUpdateRecipe(recipeToEdit._id, dataToSend);
                onRecipeUpdated(result);
                alert(`Recipe "${result.title}" updated successfully!`);
            } else {
                // --- CREATE LOGIC ---
                result = await createRecipe(dataToSend);
                onRecipeCreated(result);
                alert(`Recipe "${result.title}" created successfully!`);
            }
            
            // Clear form only after successful creation/update
            setFormData(initialFormState);
            setIsEditing(false); // Reset to creation mode

        } catch (error) {
            console.error('Form submission error:', error);
            setFormError(error.message || `Failed to ${isEditing ? 'update' : 'create'} the recipe.`);
        } finally {
            setLoading(false);
        }
    };
    
    // Function to handle the cancel button in edit mode
    const handleCancel = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        onCancelEdit();
    };

    // Determine the button label
    const submitLabel = isEditing ? 'Update Recipe' : 'Save New Recipe';

    return (
        <div className="recipe-form-container">
            <h2>{isEditing ? `Edit Recipe: ${recipeToEdit?.title}` : 'Add New Recipe'}</h2>
            
            {formError && <p className="form-error-message">{formError}</p>}
            
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <label>Title:</label>
                <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                />

                {/* Cuisine */}
                <label>Cuisine/Category:</label>
                <input 
                    type="text" 
                    name="cuisine" 
                    value={formData.cuisine} 
                    onChange={handleChange} 
                />

                {/* Prep Time */}
                <label>Prep Time (minutes):</label>
                <input 
                    type="number" 
                    name="prepTime" 
                    value={formData.prepTime} 
                    onChange={handleChange} 
                    required 
                />

                {/* Ingredients (Textarea) */}
                <label>Ingredients (One per line):</label>
                <textarea 
                    name="ingredients" 
                    value={formData.ingredients} 
                    onChange={handleChange} 
                    rows="5"
                />
                
                {/* Instructions (Textarea) */}
                <label>Instructions:</label>
                <textarea 
                    name="instructions" 
                    value={formData.instructions} 
                    onChange={handleChange} 
                    rows="7"
                />

                <div className="form-actions">
                    <button type="submit" disabled={loading}>
                        {loading ? (isEditing ? 'Updating...' : 'Saving...') : submitLabel}
                    </button>
                    
                    {/* Only show Cancel button when editing */}
                    {isEditing && (
                        <button type="button" onClick={handleCancel} className="cancel-button" disabled={loading}>
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default RecipeForm;