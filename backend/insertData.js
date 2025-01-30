const mongoose = require("mongoose");
const fs = require("fs");  // To read the JSON file
const path = require("path");  // To resolve file path
const dotenv = require("dotenv");
const Food = require("./models/Food");  // Ensure the path to Food model is correct

// Load environment variables
dotenv.config();
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB Atlas");

    // Path to your JSON file
    const filePath = path.join(__dirname, "data", "foodData.json");

    // Read the JSON file and parse it
    const fileData = fs.readFileSync(filePath, "utf-8");
    const foodItems = JSON.parse(fileData); // Parse JSON into an array of objects

    // Insert data into MongoDB
    try {
      const result = await Food.insertMany(foodItems);
      console.log("Data inserted:", result);
    } catch (error) {
      console.error("Error inserting data:", error.message);
    }

    // Close MongoDB connection
    mongoose.connection.close();
  })
  .catch((err) => console.error("MongoDB connection error:", err));
