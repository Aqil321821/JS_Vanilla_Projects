const single_mealEl = document.getElementById('single-meal');
const backBtn = document.getElementById('back-btn');
const mealTitle = document.getElementById('meal-title');

// Get the selected meal ID from sessionStorage
const mealID = sessionStorage.getItem('selectedMealID');

if (!mealID) {
  single_mealEl.innerHTML = `<p>No meal selected. Go back to search.</p>`;
} else {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      displayMeal(meal);
    });
}

// Function to display the meal details
function displayMeal(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

// Back button
backBtn.addEventListener('click', () => {
  window.location = 'index.html';
});
