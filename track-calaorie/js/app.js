class CalorieTracker {
  constructor() {
    this._calorieLimit = 2000;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
  }
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
  }
  addWorkout(workuot) {
    this._workouts.push(workuot);
    this._totalCalories -= workuot.calories;
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16);
  }
}
