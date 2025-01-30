const express = require("express");
const router = express.Router();
const Food = require("../models/Food");

// Function to convert hyphenated keys to camelCase
function convertToCamelCase(obj) {
  const result = {};
  for (const key in obj) {
    const newKey = key.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    result[newKey] = obj[key];
  }
  return result;
}

router.get("/", async (req, res) => {
  const { name } = req.query;
  try {
    const food = await Food.findOne({ name: new RegExp(name, "i") });

    if (!food) return res.status(404).send({ message: "Food not found" });

    console.log("Food data before conversion:", food); // Log the raw food data

    // Convert the nutrition fields to camelCase if they exist
    if (food["nutrition-per-100g"]) {
      food["nutrition-per-100g"] = convertToCamelCase(food["nutrition-per-100g"]);
    }
    if (food["nutrition-per-100ml"]) {
      food["nutrition-per-100ml"] = convertToCamelCase(food["nutrition-per-100ml"]);
    }

    console.log("Food data after conversion:", food); // Log the converted food data

    res.json(food);
  } catch (err) {
    res.status(500).send(err.message);
  }
});



// Route for food name suggestions (GET request)
router.get("/suggestions", async (req, res) => {
  const { query } = req.query;  // Input query from the user
  try {
    const foods = await Food.find({
      name: new RegExp(query, "i"),  // Search food names that match the query (case-insensitive)
    }).limit(10);  // Limit the number of suggestions
    const suggestions = foods.map(food => food.name);
    res.json(suggestions);
  } catch (err) {
    res.status(500).send(err.message);
  }
});




// Route for inserting new food data (POST request)
router.post("/", async (req, res) => {
  const { name, calories, protein, fat, carbs } = req.body;
  try {
    const newFood = new Food({
      name,
      calories,
      protein,
      fat,
      carbs,
    });

    // Save the new food item to the database
    await newFood.save();
    res.status(201).json({ message: "Food item added successfully!", food: newFood });
  } catch (err) {
    res.status(500).json({ message: "Error inserting food item", error: err.message });
  }
});

module.exports = router;
