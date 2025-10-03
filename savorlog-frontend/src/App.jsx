// src/App.jsx (FINAL FIX)
import { useState, useEffect, useCallback } from 'react';
import { fetchRecipes as apiFetchRecipes, deleteRecipe as apiDeleteRecipe } from './api/api'; 
import RecipeForm from './components/RecipeForm';
import MealPlanner from './components/MealPlanner'; 
import './App.css'; 
import { formatTime } from './utils/format'; 

function App() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recipeToEdit, setRecipeToEdit] = useState(null); 
    const [mealPlannerKey, setMealPlannerKey] = useState(0); 
    const [searchTerm, setSearchTerm] = useState(''); 

    // --- Fetch Recipes from API ---
    const loadRecipes = useCallback(async () => { 
        setLoading(true);
        try {
            const data = await apiFetchRecipes(); 
            setRecipes(data);
            setError(null);
        } catch (err) {
            const message = err.message || 'Could not connect to the API. Ensure your backend server is running.';
            setError(message);
            console.error("Error fetching recipes:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRecipes(); 
    }, [loadRecipes]);

    // --- Handlers ---
    const handleRecipeCreated = (newRecipe) => {
        setRecipeToEdit(null); 
        setRecipes(prev => [newRecipe, ...prev]);
    };
    
    const handleRecipeUpdated = (updatedRecipe) => {
        setRecipes(prev => 
            prev.map(r => r._id === updatedRecipe._id ? updatedRecipe : r)
        );
        setRecipeToEdit(null);
    };

    const handleDeleteRecipe = async (id, title) => {
        if (!window.confirm(`Are you sure you want to permanently delete the recipe: "${title}"?`)) return;
        try {
            await apiDeleteRecipe(id);
            setRecipes(prev => prev.filter(r => r._id !== id));
            setMealPlannerKey(prevKey => prevKey + 1); // refresh planner
            alert(`Recipe "${title}" was successfully deleted.`);
        } catch (err) {
            alert(err.message || 'Failed to delete recipe from server.');
            console.error("Error deleting recipe:", err);
        }
    };
    
    const handleEditClick = (recipe) => {
        setRecipeToEdit(recipe);
    };

    // 🛑 FINAL DRAG FIX: Use only text/plain with simple "::" delimiter
    const handleDragStart = (e, recipe) => {
        if (!recipe?._id || !recipe?.title) return;
        const dragPayload = `${recipe._id}::${recipe.title}`;
        e.dataTransfer.setData('text/plain', dragPayload);
        e.dataTransfer.setDragImage(e.currentTarget, 10, 10);
    };

    // --- Filtered Recipe List ---
    const filteredRecipes = recipes.filter(recipe => {
        const term = searchTerm.toLowerCase();
        return (
            recipe.title?.toLowerCase().includes(term) ||
            recipe.cuisine?.toLowerCase().includes(term) ||
            (Array.isArray(recipe.ingredients) && recipe.ingredients.some(ing => ing.toLowerCase().includes(term)))
        );
    });

    // --- Rendering ---
    if (loading && recipes.length === 0) return <h1 className="status-message">Loading SavorLog...</h1>;
    if (error) return <h1 className="status-message" style={{ color: 'red' }}>Error: {error}</h1>;

    return (
        <div className="app-container">
            <h1>SavorLog: Recipe Notebook & Planner</h1>
            
            {/* Planner reloads if mealPlannerKey changes */}
            <MealPlanner key={mealPlannerKey} /> 

            <div className="main-content">
                {/* Left column: Form */}
                <div className="recipe-form-col">
                    <RecipeForm 
                        recipeToEdit={recipeToEdit}
                        onRecipeCreated={handleRecipeCreated}
                        onRecipeUpdated={handleRecipeUpdated}
                        onCancelEdit={() => setRecipeToEdit(null)}
                    />
                </div>
                
                {/* Right column: Recipe List */}
                <div className="recipe-list-col">
                    <h2>Recipes ({filteredRecipes.length} of {recipes.length})</h2>
                    
                    {/* Search Bar */}
                    <div className="recipe-search">
                        <input
                            type="text"
                            placeholder="Search recipes by title, cuisine, or ingredient..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <p>Drag recipes onto the calendar above to schedule them! 👇</p>
                    
                    <div className="recipe-list">
                        {filteredRecipes.length > 0 ? (
                            filteredRecipes.map(recipe => (
                                <div 
                                    key={recipe._id} 
                                    className="recipe-card draggable-recipe"
                                    draggable="true" 
                                    onDragStart={(e) => handleDragStart(e, recipe)}
                                >
                                    <h3>{recipe.title}</h3>
                                    <p>
                                        Cuisine: <strong>{recipe.cuisine || 'N/A'}</strong> | 
                                        Prep: <strong>{formatTime(recipe.prepTime)}</strong>
                                    </p>
                                    <div className="recipe-actions">
                                        <button 
                                            className="edit-button" 
                                            onClick={(e) => { e.stopPropagation(); handleEditClick(recipe); }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="delete-button" 
                                            onClick={(e) => { e.stopPropagation(); handleDeleteRecipe(recipe._id, recipe.title); }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>
                                {searchTerm 
                                    ? `No recipes match your search for "${searchTerm}".` 
                                    : 'Start by creating a recipe!'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
