// Select elements
const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContainer = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

// Fetch recipes from the API
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "Fetching recipes...";
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();
        recipeContainer.innerHTML = "";
        if (data.meals) {
            data.meals.forEach(meal => {
                const recipeDiv = document.createElement('div'); // Changed to lowercase
                recipeDiv.classList.add('recipe');
                recipeDiv.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                    <p><span>${meal.strArea}</span> Dish</p>
                    <p>Belongs to <span>${meal.strCategory}</span> Category</p>
                `;
                const button = document.createElement('button');
                button.textContent = "View Recipe";
                recipeDiv.appendChild(button);

                // Adding event to recipe button
                button.addEventListener('click', () => {
                    openRecipePopup(meal);
                });

                recipeContainer.appendChild(recipeDiv);
            });
        } else {
            recipeContainer.innerHTML = "<p>Recipe not available. Try another search.</p>";
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        recipeContainer.innerHTML = "<p>Error fetching recipes. Please try again.</p>";
    }
};

// Open recipe popup with details
const openRecipePopup = (meal) => {
    recipeDetailsContainer.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `;

    recipeDetailsContainer.parentElement.style.display = "block";
};

// Fetch ingredients list
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure ? measure + ' ' : ''}${ingredient}</li>`; // Added space after measure if present
        } else {
            break;
        }
    }
    return ingredientsList;
};

// Close recipe popup
recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContainer.parentElement.style.display = "none";
});

// Search button event listener
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim(); // Get input value
    if (!searchInput) {
        recipeContainer.innerHTML = `<h3>Type Meal Name in search box.</h3>`;
        return;
    }
    fetchRecipes(searchInput);
});
