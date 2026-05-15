const { useEffect, useMemo, useRef, useState } = React;

const SUPABASE_URL = "https://omatlmxlyadyaiufjeur.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_J70xmAGLjKAplO0pghxs_Q_Fo6yUH-s";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STORAGE_KEYS = {
  recipes: "kitchen-companion-recipes-v4",
  deletedRecipes: "kitchen-companion-deleted-recipes-v1",
  deletedInventory: "kitchen-companion-deleted-inventory-v1",
  inventory: "kitchen-companion-inventory-v5",
  grocery: "kitchen-companion-grocery-v5",
  chopboard: "kitchen-companion-chopboard-v1",
  foodLog: "kitchen-companion-food-log-v1",
  dailyNutritionGoals: "kitchen-companion-daily-nutrition-goals-v1"
};

const INVENTORY_CATEGORIES = [
  "Produce",
  "Dairy",
  "Protein",
  "Grains",
  "Spices",
  "Soup",
  "Pantry",
  "Frozen",
  "Snacks",
  "General"
];

const GROCERY_CATEGORIES = [
  "Produce",
  "Dairy",
  "Protein",
  "Grains",
  "Spices",
  "Soup",
  "Pantry",
  "Frozen",
  "Snacks",
  "General"
];

const RECIPE_CATEGORIES = [
  "Breakfast",
  "Lunch and Dinner",
  "Soup",
  "Side",
  "Snack",
  "Dessert",
  "Drink"
];

const UNIT_OPTIONS = [
  "pcs",
  "bag",
  "carton",
  "bottle",
  "gallon",
  "can",
  "jar",
  "box",
  "cup",
  "tbsp",
  "tsp",
  "oz",
  "lb",
  "g",
  "kg",
  "pack",
  "clove",
  "bulb",
  "loaf",
  "item"
];

const PRIORITY_OPTIONS = [
  "Critical",
  "Essential",
  "Supplementary",
  "Low Priority"
];

const SERVING_SIZE_OPTIONS = [1, 2, 4, 6];
const SUBSTITUTE_ALERT_GROUP_TAGS = ["Lentil Group", "Bean Group", "Chicken Group"];

function normalizePriority(priority) {
  const normalized = String(priority || "").trim().toLowerCase();

  if (normalized === "critical" || normalized === "critic") return "Critical";
  if (normalized === "essential") return "Essential";
  if (
    normalized === "supplementary" ||
    normalized === "nice to have" ||
    normalized === "nice-to-have" ||
    normalized === "nice have" ||
    normalized === "nice"
  ) return "Supplementary";
  if (normalized === "low priority" || normalized === "low-priority" || normalized === "optional") return "Low Priority";
  return "Essential";
}

const RECIPE_IMAGE_BY_NAME = {
  "tea": "https://upload.wikimedia.org/wikipedia/commons/f/fd/A_Cup_of_Tea.jpg",
  "roti": "./assets/bread.jpg",
  "oatmeal": "./assets/oatmeal.png",
  "oats": "./assets/Oats.jpg",
  "breast toast": "./assets/bread.jpg",
  "toast": "./assets/bread.jpg",
  "avacado": "./assets/break.jpg",
  "avocado": "./assets/break.jpg",
  "eggs": "./assets/eggs.jpg",
  "simple eggs": "./assets/eggs.jpg",
  "banana": "./assets/fruits.png",
  "coffee": "https://upload.wikimedia.org/wikipedia/commons/a/ab/VN_coffee_cup.JPG",
  "pan cake": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Pancake_breakfast_%2831361530717%29.jpg/960px-Pancake_breakfast_%2831361530717%29.jpg",
  "waffles": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Belgian_Waffle_Breakfast_%2833960865713%29.jpg/3840px-Belgian_Waffle_Breakfast_%2833960865713%29.jpg",
  "chia pudding": "./assets/oatmeal.png",
  "green smoothie": "https://upload.wikimedia.org/wikipedia/commons/1/10/Green_Smoothie.jpg?utm_campaign=index&utm_content=original&utm_source=commons.wikimedia.org",
  "muffin": "https://upload.wikimedia.org/wikipedia/commons/8/83/Gfp-muffin.jpg",
  "donuts": "https://upload.wikimedia.org/wikipedia/commons/1/1c/Donuts.jpg?utm_campaign=index&utm_content=original&utm_source=commons.wikimedia.org",
  "gwar mari": "./assets/bread.jpg",
  "bagels": "https://upload.wikimedia.org/wikipedia/commons/b/b9/Alinea_-_bagel.jpg",
  "pb jelly sandwich": "./assets/bread.jpg",
  "pb jelly sandwish": "./assets/bread.jpg",
  "dal bhat": "./assets/lentils.jpg",
  "chowmein": "https://upload.wikimedia.org/wikipedia/commons/4/41/Chowmein.jpg",
  "spaghetti": "./assets/pasta.png",
  "haluwa": "./assets/haluwa.jpg",
  "malpuwa": "./assets/malpuwa.jpg",
  "mac n cheese": "https://images.pexels.com/photos/32083398/pexels-photo-32083398.jpeg",
  "mac and cheese": "https://images.pexels.com/photos/32083398/pexels-photo-32083398.jpeg",
  "alfredo pasta": "./assets/pasta.png",
  "pakoda": "https://upload.wikimedia.org/wikipedia/commons/3/30/Pakora.JPG",
  "bara": "https://upload.wikimedia.org/wikipedia/commons/4/47/Bara_%2833428%29.jpg",
  "chicken": "./assets/chicken.jpg",
  "thai basil chicken": "./assets/chicken.jpg",
  "chicken curry": "https://images.pexels.com/photos/29684985/pexels-photo-29684985.jpeg",
  "chicken soup": "./assets/noodlesoup.jpg",
  "vegetables": "./assets/veggies.jpg",
  "mixed vegetables": "./assets/veggies.jpg",
  "marinara pasta": "https://images.pexels.com/photos/33921434/pexels-photo-33921434.jpeg",
  "pizza": "https://upload.wikimedia.org/wikipedia/commons/4/41/Pizza_food.jpg",
  "burger": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Open_faced_burger.jpg",
  "wrap/sandwich": "./assets/bread.jpg",
  "salad": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Garden_salad.jpg",
  "chuira": "./assets/chuira.jpg",
  "samosa": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Indian_samosa.jpg",
  "ghundruk": "./assets/ghundruk.jpg",
  "soyabean": "./assets/veggies.jpg",
  "momos": "https://upload.wikimedia.org/wikipedia/commons/b/be/Momos.jpg",
  "burrito bowl": "https://upload.wikimedia.org/wikipedia/commons/a/a4/ChipotleBurritoBowl.jpg",
  "tacos": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Tacos_on_a_plate.jpg",
  "sel": "./assets/sel-roti.png",
  "palaak paneer": "https://upload.wikimedia.org/wikipedia/commons/d/da/Yummy_Palak_Paneer.jpg",
  "palak paneer": "https://upload.wikimedia.org/wikipedia/commons/d/da/Yummy_Palak_Paneer.jpg",
  "matar paneer": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Matar_Paneer-homemade.jpg",
  "potatoes": "./assets/potatoes.jpg",
  "spiced potatoes": "./assets/mustang-aloo.jpg",
  "spiced aloo": "./assets/mustang-aloo.jpg",
  "mustang aloo": "./assets/mustang-aloo.jpg",
  "mustang alu": "./assets/mustang-aloo.jpg",
  "mustang": "./assets/mustang-aloo.jpg",
  "choila": "./assets/choila.jpg",
  "chatpate": "./assets/chatpate.jpg",
  "pani puri": "./assets/pani-puri.jpg",
  "fried rice": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Egg_fried_rice.jpg?utm_campaign=index&utm_content=original&utm_source=commons.wikimedia.org",
  "vegetable fried rice": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Egg_fried_rice.jpg?utm_campaign=index&utm_content=original&utm_source=commons.wikimedia.org",
  "thukpa": "./assets/noodlesoup.jpg",
  "samyang noodles": "./assets/noodlesoup.jpg",
  "chauchau": "./assets/noodlesoup.jpg",
  "pho": "./assets/noodlesoup.jpg",
  "lentils": "./assets/lentils.jpg",
  "corn": "./assets/veggies.jpg",
  "airfried chickpeas": "./assets/airfried-chickpeas.jpg",
  "hummus and naan": "./assets/hummus-naan.jpg",
  "sushi": "https://upload.wikimedia.org/wikipedia/commons/8/8d/Sushi_food.jpg",
  "falafal": "./assets/falafal.jpg",
  "fish": "./assets/fish.jpg",
  "salmon": "./assets/salmon.jpg",
  "tofu": "./assets/tofu.jpg",
  "peanut butter banana smoothie": "https://upload.wikimedia.org/wikipedia/commons/d/de/Fruit_and_peanut_butter_smoothie.jpg",
  "ice cream": "./assets/ice-cream.jpg",
  "lassi": "./assets/lassi.jpg",
  "banana milk": "https://upload.wikimedia.org/wikipedia/commons/6/6d/Banana_milk.jpg",
  "fruits": "./assets/fruits.png",
  "boba": "./assets/boba.jpg",
  "chips": "https://upload.wikimedia.org/wikipedia/commons/6/69/Potato-Chips.jpg?utm_campaign=index&utm_content=original&utm_source=commons.wikimedia.org",
  "edamame": "./assets/edamame.jpg",
  "pop corn": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Popcorn_%281%29.jpg/960px-Popcorn_%281%29.jpg?utm_campaign=index&utm_content=thumbnail&utm_source=commons.wikimedia.org",
  "cake": "./assets/cake.jpg",
  "nuts": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Nuts_mixed.jpg",
  "cucumber": "https://upload.wikimedia.org/wikipedia/commons/0/0a/Sliced_Cucumber.jpg?utm_campaign=index&utm_content=original&utm_source=commons.wikimedia.org",
  "carrots": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Fresh_Carrots.jpg/1280px-Fresh_Carrots.jpg?utm_campaign=index&utm_content=thumbnail&utm_source=commons.wikimedia.org",
  "soda": "./assets/soda.jpg",
  "jaulo": "./assets/jaulo.png",
  "zeera": "./assets/zeera.jpg"
};

const RECIPE_IMAGE_BY_CATEGORY = {
  "Breakfast": "",
  "Lunch and Dinner": "",
  "Soup": "",
  "Side": "",
  "Snack": "",
  "Dessert": "",
  "Drink": ""
};

const menuRecipeSeeds = [
  ["Tea", "Breakfast"],
  ["Roti", "Breakfast"],
  ["Oatmeal", "Breakfast"],
  ["Breast Toast", "Breakfast"],
  ["Avacado", "Breakfast"],
  ["Eggs", "Breakfast"],
  ["Banana", "Breakfast"],
  ["Coffee", "Breakfast"],
  ["Pan Cake", "Breakfast"],
  ["Waffles", "Breakfast"],
  ["Chia Pudding", "Breakfast"],
  ["Green Smoothie", "Breakfast"],
  ["Muffin", "Breakfast"],
  ["Donuts", "Breakfast"],
  ["Gwar Mari", "Breakfast"],
  ["Bagels", "Breakfast"],
  ["PB Jelly Sandwich", "Breakfast"],
  ["Dal Bhat", "Lunch and Dinner"],
  ["Chowmein", "Lunch and Dinner"],
  ["Spaghetti", "Lunch and Dinner"],
  ["Haluwa", "Lunch and Dinner"],
  ["Malpuwa", "Lunch and Dinner"],
  ["Mac n Cheese", "Lunch and Dinner"],
  ["Alfredo Pasta", "Lunch and Dinner"],
  ["Pakoda", "Lunch and Dinner"],
  ["Bara", "Lunch and Dinner"],
  ["Chicken", "Lunch and Dinner"],
  ["Vegetables", "Lunch and Dinner"],
  ["Marinara Pasta", "Lunch and Dinner"],
  ["Pizza", "Lunch and Dinner"],
  ["Burger", "Lunch and Dinner"],
  ["Wrap/Sandwich", "Lunch and Dinner"],
  ["Salad", "Lunch and Dinner"],
  ["Chuira", "Lunch and Dinner"],
  ["Samosa", "Lunch and Dinner"],
  ["Ghundruk", "Lunch and Dinner"],
  ["Soyabean", "Lunch and Dinner"],
  ["Momos", "Lunch and Dinner"],
  ["Burrito Bowl", "Lunch and Dinner"],
  ["Tacos", "Lunch and Dinner"],
  ["Sel", "Lunch and Dinner"],
  ["Palaak Paneer", "Lunch and Dinner"],
  ["Matar Paneer", "Lunch and Dinner"],
  ["Potatoes", "Lunch and Dinner"],
  ["Choila", "Lunch and Dinner"],
  ["Chatpate", "Lunch and Dinner"],
  ["Pani Puri", "Lunch and Dinner"],
  ["Fried Rice", "Lunch and Dinner"],
  ["Thukpa", "Lunch and Dinner"],
  ["Samyang Noodles", "Lunch and Dinner"],
  ["Chauchau", "Lunch and Dinner"],
  ["Pho", "Lunch and Dinner"],
  ["Lentils", "Lunch and Dinner"],
  ["Corn", "Lunch and Dinner"],
  ["Airfried Chickpeas", "Lunch and Dinner"],
  ["Hummus and Naan", "Lunch and Dinner"],
  ["Sushi", "Lunch and Dinner"],
  ["Falafal", "Lunch and Dinner"],
  ["Fish", "Lunch and Dinner"],
  ["Salmon", "Lunch and Dinner"],
  ["Tofu", "Lunch and Dinner"],
  ["Peanut Butter Banana Smoothie", "Snacks"],
  ["Ice Cream", "Snacks"],
  ["Lassi", "Snacks"],
  ["Banana Milk", "Snacks"],
  ["Fruits", "Snacks"],
  ["Boba", "Snacks"],
  ["Chips", "Snacks"],
  ["Edamame", "Snacks"],
  ["Pop Corn", "Snacks"],
  ["Cake", "Snacks"],
  ["Nuts", "Snacks"],
  ["Cucumber", "Snacks"],
  ["Carrots", "Snacks"],
  ["Soda", "Snacks"]
].map(([recipeName, category]) => ({
  id: crypto.randomUUID(),
  recipeName,
  category,
  difficulty: category === "Snacks" || category === "Breakfast" ? "Easy" : "Varies",
  prepTime: "Varies",
  ingredients: "Add ingredients for this dish.",
  steps: "Add your cooking steps or preparation notes for this dish.",
  notes: "Imported from your Food Hub menu list. Update this recipe with your own ingredients and instructions.",
  tags: [normalizeRecipeCategory(category)]
}));

const defaultRecipes = [
  {
    id: crypto.randomUUID(),
    recipeName: "Thai Basil Chicken",
    category: "Lunch and Dinner",
    difficulty: "Easy",
    prepTime: "25 min",
    ingredients: "Chicken, Thai basil, garlic, chili, soy sauce, rice",
    steps: "Cook garlic and chili, add chicken, season, stir in basil, and serve over rice.",
    notes: "Fast dinner option.",
    tags: ["Thai", "Husband Friendly"]
  },
  {
    id: crypto.randomUUID(),
    recipeName: "Vegetable Fried Rice",
    category: "Lunch and Dinner",
    difficulty: "Easy",
    prepTime: "20 min",
    ingredients: "Rice, eggs, carrots, peas, soy sauce, green onion",
    steps: "Cook vegetables, add rice and eggs, then season and finish with green onion.",
    notes: "Great with leftover rice.",
    tags: ["Healthy"]
  },
  {
    id: crypto.randomUUID(),
    recipeName: "Chicken Soup",
    category: "Soup",
    difficulty: "Easy",
    prepTime: "35 min",
    ingredients: "Chicken broth, chicken, carrots, celery, garlic, ginger",
    steps: "Simmer broth, chicken, and vegetables until tender and comforting.",
    notes: "Good when someone is sick.",
    tags: ["Healthy", "Sick Day"]
  },
  {
    id: crypto.randomUUID(),
    recipeName: "Chicken Curry",
    category: "Lunch and Dinner",
    difficulty: "Medium",
    prepTime: "40 minutes",
    ingredients: "Chicken, onion, garlic, ginger, tomato, salt, turmeric, cumin, oil",
    steps: "Heat oil and cook onion until soft. Add garlic, ginger, and spices and stir briefly. Add chicken and cook until lightly browned. Add tomato and a splash of water, then simmer until the chicken is cooked through.",
    notes: "Use boneless or bone-in chicken depending on what you have. Adjust chili and spices to taste.",
    tags: ["Comfort", "Husband Friendly"]
  },
  {
    id: crypto.randomUUID(),
    recipeName: "Simple Eggs",
    category: "Breakfast",
    difficulty: "Very Easy",
    prepTime: "10 minutes",
    ingredients: "Eggs, salt, pepper, oil or butter",
    steps: "Heat a little oil or butter in a pan. Crack in the eggs and cook to your preferred doneness. Season with salt and pepper. Serve hot with toast, rice, or vegetables.",
    notes: "Scramble the eggs for a softer texture. Add chopped herbs if you want more flavor.",
    tags: ["Quick", "Husband Friendly"]
  },
  {
    id: crypto.randomUUID(),
    recipeName: "Lentils",
    category: "Lunch and Dinner",
    difficulty: "Easy",
    prepTime: "35 minutes",
    ingredients: "Lentils, onion, garlic, cumin, salt, oil, water",
    steps: "Rinse the lentils well. Cook onion, garlic, and cumin in a pot with oil. Add lentils and water, then simmer until tender. Season with salt and serve warm.",
    notes: "Add turmeric for color and warmth. Serve with rice for a complete meal.",
    tags: ["Healthy", "Budget Friendly"]
  },
  {
    id: crypto.randomUUID(),
    recipeName: "Oatmeal",
    category: "Breakfast",
    difficulty: "Easy",
    prepTime: "15 minutes",
    ingredients: "Oats, milk, maple syrup, blueberries, walnuts",
    steps: "Warm the milk in a small pot over medium heat. Stir in the oats and cook until soft and creamy. Add maple syrup and mix gently. Top with blueberries and walnuts before serving warm.",
    notes: "Use water and milk together for a lighter texture. Add banana if you want extra sweetness.",
    tags: ["Healthy", "Quick"]
  },
  {
    id: crypto.randomUUID(),
    recipeName: "Spiced Potatoes",
    category: "Side",
    difficulty: "Easy",
    prepTime: "25 minutes",
    ingredients: "Potatoes, oil, salt, turmeric, cumin, chili flakes",
    steps: "Boil or steam potatoes until just tender. Heat oil in a pan and add spices. Add potatoes and toss until coated and lightly crisped. Serve warm.",
    notes: "Use leftover boiled potatoes for a faster version. Add herbs at the end for freshness.",
    tags: ["Comfort", "Budget Friendly"]
  },
  {
    id: crypto.randomUUID(),
    recipeName: "Mixed Vegetables",
    category: "Lunch and Dinner",
    difficulty: "Easy",
    prepTime: "20 minutes",
    ingredients: "Mixed vegetables, onion, garlic, salt, oil, pepper",
    steps: "Heat oil in a pan and cook onion and garlic briefly. Add vegetables and stir-fry until tender but still bright. Season with salt and pepper. Serve hot with rice, noodles, or flatbread.",
    notes: "Use any combination of vegetables you already have. Do not overcook so the vegetables stay vibrant.",
    tags: ["Healthy", "Quick"]
  },
  ...menuRecipeSeeds
];

const defaultInventory = [
  {
    id: crypto.randomUUID(),
    itemName: "Jasmine Rice",
    category: "Grains",
    quantity: 1,
    unit: "bag",
    threshold: 1,
    notes: "Main pantry staple",
    priority: "Critical"
  },
  {
    id: crypto.randomUUID(),
    itemName: "Eggs",
    category: "Dairy",
    quantity: 0,
    unit: "pcs",
    threshold: 6,
    notes: "Finished",
    priority: "Critical"
  },
  {
    id: crypto.randomUUID(),
    itemName: "Chicken Broth",
    category: "Soup",
    quantity: 1,
    unit: "carton",
    threshold: 1,
    notes: "Useful for soup and sick days",
    priority: "Essential"
  },
  {
    id: crypto.randomUUID(),
    itemName: "Garlic",
    category: "Produce",
    quantity: 2,
    unit: "bulbs",
    threshold: 1,
    notes: "",
    priority: "Essential"
  }
];

const defaultGrocery = [
  {
    id: crypto.randomUUID(),
    itemName: "Spinach",
    quantity: 1,
    unit: "bag",
    category: "Produce",
    bought: false,
    source: "manual",
    linkedInventoryId: null,
    suppressed: false,
    priority: "Supplementary"
  }
];

const RECIPE_DETAILS_BY_NAME = {
  "dal bhat": {
    difficulty: "Medium",
    prepTime: "50 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Jasmine Rice", quantity: 2, unit: "cup" },
      { name: "Yellow Lentils", quantity: 1, unit: "cup" },
      { name: "Garlic", quantity: 4, unit: "clove" },
      { name: "Ginger", quantity: 1, unit: "tbsp" },
      { name: "Lemon", quantity: 1, unit: "piece" }
    ],
    ingredients: "Jasmine rice, yellow lentils, garlic, ginger, salt, turmeric, cumin, oil, lemon",
    steps: "Cook the rice until fluffy and keep warm. Simmer the lentils with turmeric and salt until soft, then finish with a garlic, ginger, cumin, and oil tempering. Serve the dal over rice with lemon on the side.",
    notes: "A simple dal bhat base recipe. Add tarkari, achar, or greens when you want a fuller plate.",
    tags: ["Nepali", "Comfort", "Staple Meal"]
  },
  "palaak paneer": {
    difficulty: "Medium",
    prepTime: "35 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Paneer", quantity: 200, unit: "g" },
      { name: "Spinach", quantity: 4, unit: "cup" },
      { name: "Garlic", quantity: 4, unit: "clove" },
      { name: "Ginger", quantity: 1, unit: "tbsp" }
    ],
    ingredients: "Paneer, spinach, garlic, ginger, onion, tomato, oil, cumin, garam masala, salt",
    steps: "Blanch or wilt the spinach, then blend it into a smooth puree. Saute onion, garlic, and ginger until fragrant, add tomato and spices, then stir in the spinach puree. Fold in paneer and simmer gently before serving.",
    notes: "Use cream at the end if you want a richer version, or keep it lighter with just the spinach base.",
    tags: ["Indian", "Vegetarian", "Comfort"]
  },
  "matar paneer": {
    difficulty: "Easy",
    prepTime: "30 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Paneer", quantity: 200, unit: "g" },
      { name: "Peas", quantity: 1, unit: "cup" },
      { name: "Garlic", quantity: 3, unit: "clove" },
      { name: "Ginger", quantity: 1, unit: "tbsp" }
    ],
    ingredients: "Paneer, peas, onion, garlic, ginger, tomato, oil, cumin, coriander, salt",
    steps: "Cook onion, garlic, and ginger until soft, then add tomato and spices to make a quick masala. Stir in peas and a splash of water, then add paneer and simmer until everything is heated through.",
    notes: "A good weeknight paneer dish. Add chili if you want more heat.",
    tags: ["Indian", "Vegetarian", "Quick"]
  },
  "chowmein": {
    difficulty: "Easy",
    prepTime: "25 minutes",
    servings: 3,
    structuredIngredients: [
      { name: "Chowmein Masala", quantity: 1, unit: "box" },
      { name: "Vegetables", quantity: 2, unit: "cup" },
      { name: "Garlic", quantity: 3, unit: "clove" },
      { name: "Soy Sauce", quantity: 1, unit: "tbsp" }
    ],
    ingredients: "Noodles, vegetables, garlic, oil, soy sauce, chowmein masala, salt, pepper",
    steps: "Boil the noodles until just tender and set them aside. Stir-fry garlic and vegetables in a hot pan, then add noodles, soy sauce, chowmein masala, and seasonings. Toss until everything is evenly coated and hot.",
    notes: "Use any vegetables you have and keep the noodles slightly firm so they do not turn mushy.",
    tags: ["Nepali", "Indian-Chinese", "Quick"]
  },
  "thukpa": {
    difficulty: "Medium",
    prepTime: "35 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Chicken Broth", quantity: 1, unit: "carton" },
      { name: "Garlic", quantity: 4, unit: "clove" },
      { name: "Ginger", quantity: 1, unit: "tbsp" },
      { name: "Vegetables", quantity: 2, unit: "cup" }
    ],
    ingredients: "Noodles, broth, garlic, ginger, vegetables, soy sauce, salt, pepper, chili",
    steps: "Simmer broth with garlic, ginger, and vegetables until flavorful. Add noodles and cook until tender, then season with soy sauce, salt, pepper, and chili. Serve hot as a comforting bowl soup.",
    notes: "A flexible thukpa base. Add chicken or momo on the side if you want it more filling.",
    tags: ["Nepali", "Soup", "Comfort"]
  },
  "momos": {
    difficulty: "Medium",
    prepTime: "60 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Chicken", quantity: 500, unit: "g" },
      { name: "Garlic", quantity: 5, unit: "clove" },
      { name: "Ginger", quantity: 1, unit: "tbsp" },
      { name: "Momo Masala", quantity: 1, unit: "box" }
    ],
    ingredients: "Momo wrappers, minced chicken or vegetables, garlic, ginger, onion, momo masala, salt, oil",
    steps: "Mix the filling with garlic, ginger, onion, momo masala, and salt. Fill each wrapper, fold tightly, and steam until cooked through. Serve with achar or a spicy dipping sauce.",
    notes: "This can be adapted for chicken, paneer, or vegetable fillings depending on what you have.",
    tags: ["Nepali", "Favorite", "Meal Prep"]
  },
  "fried rice": {
    difficulty: "Easy",
    prepTime: "20 minutes",
    servings: 3,
    structuredIngredients: [
      { name: "Jasmine Rice", quantity: 3, unit: "cup" },
      { name: "Eggs", quantity: 2, unit: "piece" },
      { name: "Peas", quantity: 1, unit: "cup" },
      { name: "Soy Sauce", quantity: 1, unit: "tbsp" }
    ],
    ingredients: "Cooked rice, eggs, peas, carrots, garlic, soy sauce, oil, green onion",
    steps: "Heat oil in a pan and scramble the eggs first. Add garlic and vegetables, then stir in the rice and soy sauce. Toss until the rice is hot and lightly crisped, then finish with green onion.",
    notes: "Best made with chilled leftover rice so it stays separated and fries well.",
    tags: ["Quick", "Leftovers", "Comfort"]
  },
  "wrap/sandwich": {
    difficulty: "Easy",
    prepTime: "15 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Chicken", quantity: 200, unit: "g" },
      { name: "Lemon", quantity: 1, unit: "piece" },
      { name: "Garlic", quantity: 2, unit: "clove" },
      { name: "Ketchup", quantity: 1, unit: "tbsp" }
    ],
    ingredients: "Wrap or bread, cooked chicken or paneer, lettuce, cucumber, ketchup or sauce, salt, pepper",
    steps: "Warm the wrap or toast the bread. Add the filling, vegetables, and sauce, then roll or stack it tightly. Slice and serve right away.",
    notes: "Good for using leftovers. Swap chicken for paneer, eggs, or vegetables easily.",
    tags: ["Quick", "Lunch", "Flexible"]
  },
  "choila": {
    difficulty: "Medium",
    prepTime: "35 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Chicken", quantity: 500, unit: "g" },
      { name: "Garlic", quantity: 4, unit: "clove" },
      { name: "Ginger", quantity: 1, unit: "tbsp" },
      { name: "Lemon", quantity: 1, unit: "piece" }
    ],
    ingredients: "Chicken or buffalo meat, garlic, ginger, lemon, mustard oil, chili, cumin, salt",
    steps: "Cook or grill the meat until tender, then slice it into bite-size pieces. Toss with garlic, ginger, lemon, spices, salt, and a little mustard oil. Let it rest briefly so the flavors soak in before serving.",
    notes: "A smoky and spicy Nepali-style choila. Best served with chiura or as part of a snack plate.",
    tags: ["Nepali", "Spicy", "Snack Plate"]
  },
  "chatpate": {
    difficulty: "Easy",
    prepTime: "15 minutes",
    servings: 3,
    structuredIngredients: [
      { name: "Chuira", quantity: 2, unit: "cup" },
      { name: "Lemon", quantity: 1, unit: "piece" },
      { name: "Chatpata Masala", quantity: 1, unit: "box" }
    ],
    ingredients: "Puffed rice or beaten rice, onion, tomato, cucumber, lemon, chili, chatpata masala, salt",
    steps: "Mix the dry base with chopped vegetables and seasonings in a large bowl. Squeeze lemon over the top and toss well so everything is evenly coated. Serve immediately while it is still crisp.",
    notes: "A quick Nepali street-style snack. Adjust chili and tanginess to taste.",
    tags: ["Nepali", "Snack", "Street Food"]
  },
  "pakoda": {
    difficulty: "Easy",
    prepTime: "25 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Vegetables", quantity: 2, unit: "cup" },
      { name: "Garlic", quantity: 2, unit: "clove" },
      { name: "Lemon", quantity: 1, unit: "piece" }
    ],
    ingredients: "Gram flour, sliced vegetables, garlic, chili, turmeric, cumin, salt, water, oil",
    steps: "Make a thick batter with gram flour, spices, and a little water. Fold in the vegetables, then fry spoonfuls in hot oil until golden and crisp. Drain and serve hot.",
    notes: "Works well with onion, potato, spinach, or mixed vegetables. Serve with tea or chutney.",
    tags: ["Snack", "Comfort", "Tea Time"]
  },
  "bara": {
    difficulty: "Medium",
    prepTime: "45 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Black Lentils", quantity: 1, unit: "cup" },
      { name: "Garlic", quantity: 3, unit: "clove" },
      { name: "Ginger", quantity: 1, unit: "tbsp" }
    ],
    ingredients: "Black lentils, garlic, ginger, cumin, salt, oil",
    steps: "Soak the lentils, then grind them into a thick batter with garlic, ginger, and spices. Shape small patties and fry them until crisp outside and tender inside. Serve warm.",
    notes: "A classic Newari-style lentil fritter. Good on its own or as part of a larger meal.",
    tags: ["Nepali", "Newari", "Snack"]
  },
  "sel": {
    difficulty: "Medium",
    prepTime: "60 minutes",
    servings: 6,
    structuredIngredients: [
      { name: "Jasmine Rice", quantity: 2, unit: "cup" },
      { name: "Sugar", quantity: 0.5, unit: "cup" }
    ],
    ingredients: "Rice flour or soaked rice batter, sugar, milk, cardamom, oil or ghee",
    steps: "Prepare a smooth batter and let it rest briefly. Pour it into hot oil in ring shapes and fry until lightly golden on both sides. Drain and cool slightly before serving.",
    notes: "Sel roti is festive and special. Cardamom gives it its familiar sweet aroma.",
    tags: ["Nepali", "Festive", "Traditional"]
  },
  "samosa": {
    difficulty: "Medium",
    prepTime: "45 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Potatoes", quantity: 3, unit: "piece" },
      { name: "Peas", quantity: 1, unit: "cup" },
      { name: "Garlic", quantity: 2, unit: "clove" }
    ],
    ingredients: "Samosa wrappers or dough, potatoes, peas, garlic, ginger, cumin, chili, salt, oil",
    steps: "Cook the potato filling with peas and spices until flavorful. Fill each wrapper, seal tightly, and fry until crisp and golden. Serve hot with chutney or ketchup.",
    notes: "A great make-ahead snack. Make smaller ones for appetizers or tea time.",
    tags: ["Snack", "Comfort", "Party Food"]
  },
  "ghundruk": {
    difficulty: "Easy",
    prepTime: "25 minutes",
    servings: 3,
    structuredIngredients: [
      { name: "Ghundruk", quantity: 2, unit: "cup" },
      { name: "Garlic", quantity: 3, unit: "clove" },
      { name: "Ginger", quantity: 1, unit: "tbsp" }
    ],
    ingredients: "Ghundruk, garlic, ginger, onion, tomato, chili, salt, oil",
    steps: "Rinse the ghundruk lightly, then simmer it with onion, garlic, ginger, tomato, and spices until soft and flavorful. Adjust salt and serve warm as a side or light dish.",
    notes: "A fermented leafy green staple with a tangy flavor. Often served alongside rice and dal.",
    tags: ["Nepali", "Fermented", "Traditional"]
  },
  "soyabean": {
    difficulty: "Easy",
    prepTime: "25 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Soyabean", quantity: 2, unit: "cup" },
      { name: "Garlic", quantity: 3, unit: "clove" },
      { name: "Ginger", quantity: 1, unit: "tbsp" }
    ],
    ingredients: "Soy chunks, onion, garlic, ginger, tomato, salt, turmeric, cumin, oil",
    steps: "Soak or boil the soy chunks until softened, then squeeze out the excess liquid. Cook onion, garlic, ginger, tomato, and spices in oil, then add the soy chunks and simmer until the flavors come together.",
    notes: "A simple soy chunk curry-style base. Good with rice, roti, or as a protein add-in.",
    tags: ["Protein", "Budget Friendly", "Pantry Meal"]
  },
  "spaghetti": {
    difficulty: "Easy",
    prepTime: "25 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Spaghetti", quantity: 400, unit: "g" },
      { name: "Garlic", quantity: 3, unit: "clove" },
      { name: "Marinara Sauce", quantity: 1, unit: "jar" }
    ],
    ingredients: "Spaghetti, garlic, oil, marinara sauce, salt, pepper, parmesan if available",
    steps: "Boil the spaghetti until just tender and reserve a little pasta water. Warm the sauce with garlic in a separate pan, then toss in the pasta and loosen with pasta water as needed. Finish with pepper and serve hot.",
    notes: "A basic spaghetti dinner that works well as a weeknight fallback. Add vegetables or chicken if you want it heartier.",
    tags: ["Quick", "Pasta", "Comfort"]
  },
  "marinara pasta": {
    difficulty: "Easy",
    prepTime: "20 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Pasta", quantity: 400, unit: "g" },
      { name: "Marinara Sauce", quantity: 1, unit: "jar" },
      { name: "Garlic", quantity: 2, unit: "clove" }
    ],
    ingredients: "Pasta, marinara sauce, garlic, olive oil, salt, pepper",
    steps: "Cook the pasta until tender. Warm the marinara with garlic in a pan, then combine with the pasta and toss until evenly coated. Serve hot with a little pepper on top.",
    notes: "Very flexible and easy. Add vegetables or extra protein when you want to build it out.",
    tags: ["Pasta", "Quick", "Weeknight"]
  },
  "alfredo pasta": {
    difficulty: "Easy",
    prepTime: "25 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Pasta", quantity: 400, unit: "g" },
      { name: "Alfredo Sauce", quantity: 1, unit: "jar" },
      { name: "Garlic", quantity: 2, unit: "clove" }
    ],
    ingredients: "Pasta, alfredo sauce, garlic, butter or oil, black pepper",
    steps: "Cook the pasta until tender and set aside. Warm the alfredo sauce with garlic in a pan, then stir in the pasta and coat everything evenly. Serve hot with black pepper.",
    notes: "Rich and simple. Add chicken or vegetables if you want to turn it into a fuller meal.",
    tags: ["Pasta", "Comfort", "Creamy"]
  },
  "mac n cheese": {
    difficulty: "Easy",
    prepTime: "20 minutes",
    servings: 3,
    structuredIngredients: [
      { name: "Pasta", quantity: 300, unit: "g" },
      { name: "Paneer", quantity: 100, unit: "g" }
    ],
    ingredients: "Macaroni pasta, milk, cheese or cheese sauce, butter, salt, pepper",
    steps: "Cook the pasta until soft and drain it well. Stir it into a warm cheese sauce and cook briefly until creamy and coated. Serve immediately while hot.",
    notes: "Use any simple cheese sauce base you like. Good as a comfort meal or quick side.",
    tags: ["Comfort", "Pasta", "Quick"]
  },
  "tea": {
    difficulty: "Very Easy",
    prepTime: "10 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Tata Tea", quantity: 2, unit: "tbsp" },
      { name: "Sugar", quantity: 2, unit: "tbsp" }
    ],
    ingredients: "Tea leaves, water, milk, sugar, cardamom or ginger if desired",
    steps: "Bring water to a simmer with tea leaves and any spices you want to use. Add milk and sugar, simmer briefly, then strain into cups and serve hot.",
    notes: "Use green tea or black tea depending on the style you want. Adjust sugar and milk to taste.",
    tags: ["Drink", "Comfort", "Daily Routine"]
  },
  "roti": {
    difficulty: "Easy",
    prepTime: "30 minutes",
    servings: 6,
    structuredIngredients: [
      { name: "Flour", quantity: 2, unit: "cup" },
      { name: "Salt", quantity: 1, unit: "tsp" }
    ],
    ingredients: "Whole wheat flour, water, salt, optional oil or ghee",
    steps: "Mix flour, salt, and water into a soft dough and let it rest briefly. Divide into balls, roll each one thin, and cook on a hot pan until both sides are lightly browned. Serve warm.",
    notes: "Brush with ghee if you want a softer finish. Keep covered so the roti stays tender.",
    tags: ["Staple", "Flatbread", "Everyday"]
  },
  "avacado": {
    difficulty: "Very Easy",
    prepTime: "10 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Avocado", quantity: 1, unit: "piece" },
      { name: "Lemon", quantity: 0.5, unit: "piece" }
    ],
    ingredients: "Avocado, lemon, salt, pepper, bread or toast if serving that way",
    steps: "Slice or mash the avocado and season it with lemon, salt, and pepper. Serve it on toast, with eggs, or as a quick side for breakfast.",
    notes: "You can add chili flakes or a drizzle of olive oil for extra flavor.",
    tags: ["Breakfast", "Quick", "Fresh"]
  },
  "chia pudding": {
    difficulty: "Very Easy",
    prepTime: "Overnight",
    servings: 2,
    structuredIngredients: [
      { name: "Chia Seeds", quantity: 4, unit: "tbsp" },
      { name: "Milk", quantity: 1, unit: "cup" }
    ],
    ingredients: "Chia seeds, milk, maple syrup or honey, fruit, optional nuts",
    steps: "Whisk the chia seeds with milk and sweetener, then refrigerate until thickened. Stir once or twice while setting if needed. Top with fruit or nuts before serving.",
    notes: "A make-ahead breakfast or snack that works well with berries, banana, or granola.",
    tags: ["Breakfast", "Meal Prep", "Healthy"]
  },
  "pb jelly sandwich": {
    difficulty: "Very Easy",
    prepTime: "5 minutes",
    servings: 1,
    structuredIngredients: [
      { name: "Bread", quantity: 2, unit: "piece" },
      { name: "Peanut Butter", quantity: 2, unit: "tbsp" }
    ],
    ingredients: "Bread, peanut butter, jelly or jam",
    steps: "Spread peanut butter on one slice of bread and jelly on the other. Press together, slice if you want, and serve immediately.",
    notes: "A quick breakfast or snack. Add banana slices if you want a little more substance.",
    tags: ["Snack", "Quick", "Lunchbox"]
  },
  "haluwa": {
    difficulty: "Easy",
    prepTime: "20 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Sugar", quantity: 0.75, unit: "cup" },
      { name: "Cardamom", quantity: 1, unit: "tsp" }
    ],
    ingredients: "Semolina or flour, ghee, sugar, water or milk, cardamom, optional nuts",
    steps: "Toast the semolina or flour in ghee until fragrant. Add the liquid carefully, stir until smooth, then sweeten and cook until thick. Finish with cardamom and serve warm.",
    notes: "A comforting sweet dish that can be made simple or festive depending on toppings.",
    tags: ["Dessert", "Comfort", "Traditional"]
  },
  "malpuwa": {
    difficulty: "Medium",
    prepTime: "35 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Flour", quantity: 1.5, unit: "cup" },
      { name: "Sugar", quantity: 0.5, unit: "cup" }
    ],
    ingredients: "Flour, milk, sugar, cardamom, oil or ghee for frying",
    steps: "Make a pourable batter with flour, milk, sugar, and cardamom. Fry small rounds until golden on both sides and serve warm.",
    notes: "A sweet fried treat that works well for festivals, brunch, or a special breakfast.",
    tags: ["Dessert", "Festive", "Traditional"]
  },
  "chicken": {
    difficulty: "Easy",
    prepTime: "30 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Chicken Breast", quantity: 500, unit: "g" },
      { name: "Garlic", quantity: 3, unit: "clove" },
      { name: "Ginger", quantity: 1, unit: "tbsp" }
    ],
    ingredients: "Chicken, garlic, ginger, salt, pepper, oil, optional spices",
    steps: "Season the chicken with salt, pepper, garlic, and ginger. Cook it in a pan or oven until fully done and lightly browned. Slice and serve as a simple protein base for meals.",
    notes: "A flexible plain chicken recipe you can pair with rice, vegetables, wraps, or salads.",
    tags: ["Protein", "Meal Prep", "Flexible"]
  },
  "vegetables": {
    difficulty: "Easy",
    prepTime: "20 minutes",
    servings: 3,
    structuredIngredients: [
      { name: "Vegetables", quantity: 3, unit: "cup" },
      { name: "Garlic", quantity: 2, unit: "clove" }
    ],
    ingredients: "Mixed vegetables, garlic, oil, salt, pepper, optional soy sauce or herbs",
    steps: "Heat oil in a pan and cook the garlic briefly. Add the vegetables and stir-fry or saute until tender but still bright, then season and serve hot.",
    notes: "Works as a side dish or base for rice, noodles, or wraps.",
    tags: ["Healthy", "Quick", "Side Dish"]
  },
  "pizza": {
    difficulty: "Easy",
    prepTime: "30 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Marinara Sauce", quantity: 0.5, unit: "jar" },
      { name: "Paneer", quantity: 150, unit: "g" }
    ],
    ingredients: "Pizza dough or base, marinara sauce, cheese, vegetables or toppings of choice",
    steps: "Spread sauce over the dough or pizza base, add cheese and toppings, then bake until the crust is crisp and the top is bubbly. Slice and serve hot.",
    notes: "Use leftover vegetables or paneer to make it more filling.",
    tags: ["Comfort", "Party Food", "Flexible"]
  },
  "burger": {
    difficulty: "Easy",
    prepTime: "20 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Chicken", quantity: 250, unit: "g" },
      { name: "Ketchup", quantity: 1, unit: "tbsp" }
    ],
    ingredients: "Burger buns, patty, lettuce, onion, tomato, ketchup or sauce, salt, pepper",
    steps: "Cook the patty until done and warm the buns lightly. Assemble with vegetables and sauce, then serve right away.",
    notes: "Use chicken, veggie, or paneer patties depending on what you have.",
    tags: ["Comfort", "Quick", "Lunch"]
  },
  "salad": {
    difficulty: "Very Easy",
    prepTime: "10 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Cucumber", quantity: 1, unit: "piece" },
      { name: "Lemon", quantity: 1, unit: "piece" }
    ],
    ingredients: "Cucumber, carrots, lettuce or greens, lemon, salt, pepper, optional olive oil",
    steps: "Chop the vegetables, toss them together, and season with lemon, salt, and pepper. Add oil or herbs if you want a fuller dressing.",
    notes: "A simple everyday salad that works well beside heavier meals.",
    tags: ["Healthy", "Fresh", "Side Dish"]
  },
  "banana": {
    difficulty: "Very Easy",
    prepTime: "2 minutes",
    servings: 1,
    structuredIngredients: [
      { name: "Banana", quantity: 1, unit: "piece" }
    ],
    ingredients: "Banana",
    steps: "Peel the banana and eat it as-is or slice it over oatmeal, toast, or yogurt.",
    notes: "A simple, quick breakfast or snack item that also works well in smoothies.",
    tags: ["Snack", "Quick", "Fresh"]
  },
  "coffee": {
    difficulty: "Very Easy",
    prepTime: "10 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Coffee", quantity: 2, unit: "tbsp" },
      { name: "Sugar", quantity: 2, unit: "tsp" }
    ],
    ingredients: "Coffee grounds or instant coffee, hot water, milk, sugar",
    steps: "Brew the coffee or mix it with hot water, then add milk and sugar to taste. Serve warm.",
    notes: "Keep it simple for everyday drinking, or make it stronger if you want a more concentrated cup.",
    tags: ["Drink", "Daily Routine", "Quick"]
  },
  "pan cake": {
    difficulty: "Easy",
    prepTime: "20 minutes",
    servings: 3,
    structuredIngredients: [
      { name: "Eggs", quantity: 2, unit: "piece" },
      { name: "Milk", quantity: 1, unit: "cup" },
      { name: "Sugar", quantity: 2, unit: "tbsp" }
    ],
    ingredients: "Flour, eggs, milk, sugar, baking powder, butter or oil",
    steps: "Whisk the batter until smooth. Pour onto a hot pan in small rounds and cook until bubbles form, then flip and finish the other side. Serve warm with syrup or fruit.",
    notes: "A simple homemade pancake base that works for breakfast or brunch.",
    tags: ["Breakfast", "Comfort", "Weekend"]
  },
  "waffles": {
    difficulty: "Easy",
    prepTime: "25 minutes",
    servings: 3,
    structuredIngredients: [
      { name: "Eggs", quantity: 2, unit: "piece" },
      { name: "Milk", quantity: 1, unit: "cup" },
      { name: "Sugar", quantity: 2, unit: "tbsp" }
    ],
    ingredients: "Flour, eggs, milk, sugar, baking powder, butter or oil",
    steps: "Prepare a smooth batter and pour it into a preheated waffle maker. Cook until crisp and golden, then serve warm with syrup or fruit.",
    notes: "Good for special breakfasts and easy to top with fruit, yogurt, or nut butter.",
    tags: ["Breakfast", "Weekend", "Comfort"]
  },
  "green smoothie": {
    difficulty: "Very Easy",
    prepTime: "5 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Spinach", quantity: 2, unit: "cup" },
      { name: "Banana", quantity: 1, unit: "piece" }
    ],
    ingredients: "Spinach, banana, milk or water, optional peanut butter or chia seeds",
    steps: "Add everything to a blender and blend until smooth. Adjust the thickness with more liquid if needed and serve immediately.",
    notes: "A good way to add greens to breakfast or a quick snack.",
    tags: ["Breakfast", "Healthy", "Quick"]
  },
  "muffin": {
    difficulty: "Easy",
    prepTime: "30 minutes",
    servings: 6,
    structuredIngredients: [
      { name: "Eggs", quantity: 2, unit: "piece" },
      { name: "Sugar", quantity: 0.5, unit: "cup" }
    ],
    ingredients: "Flour, eggs, sugar, milk, oil or butter, baking powder, optional fruit or chocolate chips",
    steps: "Mix the batter just until combined, spoon it into muffin cups, and bake until the tops are set and lightly golden. Cool slightly before serving.",
    notes: "A flexible muffin base you can adapt with fruit, nuts, or chocolate.",
    tags: ["Snack", "Baked", "Make Ahead"]
  },
  "donuts": {
    difficulty: "Medium",
    prepTime: "40 minutes",
    servings: 6,
    structuredIngredients: [
      { name: "Flour", quantity: 2, unit: "cup" },
      { name: "Sugar", quantity: 0.5, unit: "cup" }
    ],
    ingredients: "Flour, sugar, milk, butter or oil, yeast or baking powder, optional glaze",
    steps: "Make the dough or batter, shape the donuts, and fry or bake until golden. Glaze or dust them once slightly cooled.",
    notes: "Best for a treat day rather than everyday breakfast.",
    tags: ["Snack", "Treat", "Sweet"]
  },
  "gwar mari": {
    difficulty: "Easy",
    prepTime: "10 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Bread", quantity: 4, unit: "piece" },
      { name: "Eggs", quantity: 2, unit: "piece" }
    ],
    ingredients: "Bread, eggs, salt, sugar or spices depending on style, oil or butter",
    steps: "Dip the bread in the egg mixture and fry it on both sides until golden. Serve warm as a quick breakfast.",
    notes: "This works as a sweet or savory breakfast depending on how you season the egg mixture.",
    tags: ["Breakfast", "Quick", "Comfort"]
  },
  "bagels": {
    difficulty: "Very Easy",
    prepTime: "8 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Bagels", quantity: 2, unit: "piece" },
      { name: "Cream Cheese", quantity: 2, unit: "tbsp" }
    ],
    ingredients: "Bagels, cream cheese, butter, jam, or sandwich fillings",
    steps: "Slice and toast the bagel if you like. Spread with cream cheese, butter, jam, or turn it into a breakfast sandwich.",
    notes: "Simple and flexible depending on whether you want sweet or savory toppings.",
    tags: ["Breakfast", "Quick", "Flexible"]
  },
  "chuira": {
    difficulty: "Very Easy",
    prepTime: "5 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Chuira", quantity: 2, unit: "cup" }
    ],
    ingredients: "Beaten rice, optional yogurt, milk, banana, sugar, or savory sides",
    steps: "Serve the beaten rice as-is or pair it with yogurt, fruit, tea, or savory items like choila or achar.",
    notes: "A flexible Nepali staple that can be eaten as a light meal, snack, or side.",
    tags: ["Nepali", "Staple", "Flexible"]
  },
  "burrito bowl": {
    difficulty: "Easy",
    prepTime: "20 minutes",
    servings: 3,
    structuredIngredients: [
      { name: "Jasmine Rice", quantity: 2, unit: "cup" },
      { name: "Black-Eyed Peas", quantity: 1, unit: "cup" },
      { name: "Chicken", quantity: 250, unit: "g" }
    ],
    ingredients: "Rice, beans, chicken or paneer, vegetables, salsa, sauce, lemon or lime",
    steps: "Build the bowl with rice as the base, then add protein, beans, vegetables, and sauce. Finish with lemon or lime and serve warm or room temperature.",
    notes: "A good meal-prep style bowl that can be customized with whatever you have.",
    tags: ["Meal Prep", "Flexible", "Balanced"]
  },
  "tacos": {
    difficulty: "Easy",
    prepTime: "20 minutes",
    servings: 3,
    structuredIngredients: [
      { name: "Chicken", quantity: 250, unit: "g" },
      { name: "Lemon", quantity: 1, unit: "piece" }
    ],
    ingredients: "Taco shells or tortillas, chicken or beans, lettuce, onion, tomato, sauce, lemon or lime",
    steps: "Warm the shells or tortillas, fill them with the cooked protein and toppings, then finish with sauce and lemon or lime. Serve right away.",
    notes: "A simple taco night base that can be adapted with chicken, paneer, or bean fillings.",
    tags: ["Quick", "Party Food", "Flexible"]
  },
  "eggs": {
    difficulty: "Very Easy",
    prepTime: "10 minutes",
    servings: 1,
    structuredIngredients: [
      { name: "Eggs", quantity: 2, unit: "piece" }
    ],
    ingredients: "Eggs, salt, pepper, oil or butter",
    steps: "Cook the eggs any way you like, such as fried, scrambled, or boiled. Season simply and serve hot.",
    notes: "A flexible egg entry for quick breakfasts or protein add-ons.",
    tags: ["Breakfast", "Protein", "Quick"]
  },
  "potatoes": {
    difficulty: "Easy",
    prepTime: "25 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Potatoes", quantity: 4, unit: "piece" },
      { name: "Garlic", quantity: 2, unit: "clove" }
    ],
    ingredients: "Potatoes, oil, salt, garlic, pepper, optional herbs or spices",
    steps: "Boil, roast, or pan-fry the potatoes until tender and lightly crisped. Season them while hot and serve as a side or simple main base.",
    notes: "Use this as a general potato recipe base when you want something versatile.",
    tags: ["Staple", "Side Dish", "Comfort"]
  },
  "pani puri": {
    difficulty: "Medium",
    prepTime: "35 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Potatoes", quantity: 3, unit: "piece" },
      { name: "Lemon", quantity: 1, unit: "piece" }
    ],
    ingredients: "Puri shells, potatoes, chickpeas, pani, chutney, spices",
    steps: "Prepare the potato and chickpea filling, then make or mix the flavored pani. Fill each puri just before eating and serve immediately so they stay crisp.",
    notes: "Best assembled fresh. The balance of tangy water and spicy filling is what makes it fun.",
    tags: ["Snack", "Street Food", "Party Food"]
  },
  "samyang noodles": {
    difficulty: "Very Easy",
    prepTime: "10 minutes",
    servings: 1,
    structuredIngredients: [
      { name: "Samyang Noodles", quantity: 1, unit: "piece" }
    ],
    ingredients: "Samyang noodles packet, water, included seasoning, optional egg or vegetables",
    steps: "Boil the noodles until tender, drain most of the water, then stir in the seasoning until fully coated. Add an egg or vegetables if you want to make it more substantial.",
    notes: "A quick spicy noodle option. Adjust the sauce amount if you want it less intense.",
    tags: ["Quick", "Instant Noodles", "Spicy"]
  },
  "chauchau": {
    difficulty: "Very Easy",
    prepTime: "10 minutes",
    servings: 1,
    structuredIngredients: [
      { name: "Chauchau", quantity: 1, unit: "piece" }
    ],
    ingredients: "Instant noodles packet, water, seasoning, optional vegetables or egg",
    steps: "Cook the noodles in water until soft, then mix in the seasoning. Add any quick extras you want and serve hot.",
    notes: "A basic instant noodle meal that can be upgraded with vegetables, egg, or leftover protein.",
    tags: ["Quick", "Instant Noodles", "Comfort"]
  },
  "pho": {
    difficulty: "Medium",
    prepTime: "40 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Chicken Broth", quantity: 1, unit: "carton" },
      { name: "Garlic", quantity: 3, unit: "clove" },
      { name: "Ginger", quantity: 1, unit: "tbsp" }
    ],
    ingredients: "Broth, rice noodles, garlic, ginger, herbs, protein of choice, lime or lemon",
    steps: "Build the broth with garlic and ginger until aromatic. Cook the noodles separately, then combine them in bowls with the hot broth and desired toppings. Serve immediately.",
    notes: "A flexible noodle soup base inspired by pho-style flavors. Add herbs and protein based on what you have.",
    tags: ["Soup", "Comfort", "Noodle Bowl"]
  },
  "corn": {
    difficulty: "Very Easy",
    prepTime: "10 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Corn", quantity: 2, unit: "piece" },
      { name: "Lemon", quantity: 0.5, unit: "piece" }
    ],
    ingredients: "Corn, salt, butter, chili, lemon",
    steps: "Boil, steam, or roast the corn until tender. Season with salt, butter, chili, and lemon before serving.",
    notes: "Works as a simple snack or side dish and can be adjusted sweet, salty, or spicy.",
    tags: ["Snack", "Side Dish", "Simple"]
  },
  "airfried chickpeas": {
    difficulty: "Easy",
    prepTime: "20 minutes",
    servings: 3,
    structuredIngredients: [
      { name: "White Chana", quantity: 2, unit: "cup" },
      { name: "Chat Masala", quantity: 1, unit: "tsp" }
    ],
    ingredients: "Cooked chickpeas, oil, salt, chat masala or spice mix",
    steps: "Dry the chickpeas well, toss with oil and spices, then air-fry until crisp. Let them cool slightly before eating so they stay crunchy.",
    notes: "A great high-protein snack that stores well for short periods after cooking.",
    tags: ["Snack", "Protein", "Healthy"]
  },
  "hummus and naan": {
    difficulty: "Easy",
    prepTime: "15 minutes",
    servings: 3,
    structuredIngredients: [
      { name: "White Chana", quantity: 2, unit: "cup" },
      { name: "Garlic", quantity: 2, unit: "clove" },
      { name: "Lemon", quantity: 1, unit: "piece" }
    ],
    ingredients: "Chickpeas, garlic, lemon, tahini or oil, salt, naan",
    steps: "Blend the hummus ingredients until smooth, adjusting lemon and salt to taste. Warm the naan and serve alongside the hummus.",
    notes: "Good as a snack plate, light lunch, or party dip setup.",
    tags: ["Snack", "Dip", "Protein"]
  },
  "sushi": {
    difficulty: "Medium",
    prepTime: "45 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "Jasmine Rice", quantity: 2, unit: "cup" },
      { name: "Cucumber", quantity: 1, unit: "piece" }
    ],
    ingredients: "Cooked sushi-style rice, seaweed sheets, cucumber, avocado, fish or tofu, soy sauce",
    steps: "Prepare the rice and fillings first, then roll or assemble the sushi with seaweed and your chosen ingredients. Slice and serve with soy sauce.",
    notes: "A flexible homemade sushi base. Keep it simple with vegetables if you want a lighter version.",
    tags: ["Meal Prep", "Fresh", "Fun"]
  },
  "falafal": {
    difficulty: "Medium",
    prepTime: "35 minutes",
    servings: 4,
    structuredIngredients: [
      { name: "White Chana", quantity: 2, unit: "cup" },
      { name: "Garlic", quantity: 3, unit: "clove" }
    ],
    ingredients: "Chickpeas, garlic, onion, herbs, cumin, coriander, salt, oil",
    steps: "Blend the mixture until coarse but moldable, shape into small balls or patties, then fry or bake until crisp outside and cooked through. Serve with salad, wraps, or dip.",
    notes: "A nice protein-rich option that can be eaten as a snack, side, or main filling.",
    tags: ["Protein", "Snack", "Vegetarian"]
  },
  "fish": {
    difficulty: "Easy",
    prepTime: "25 minutes",
    servings: 3,
    structuredIngredients: [
      { name: "Fish", quantity: 400, unit: "g" },
      { name: "Garlic", quantity: 2, unit: "clove" },
      { name: "Lemon", quantity: 1, unit: "piece" }
    ],
    ingredients: "Fish, garlic, lemon, salt, pepper, oil",
    steps: "Season the fish with garlic, lemon, salt, and pepper. Pan-cook or bake it until flaky and fully cooked, then serve immediately.",
    notes: "A flexible fish entry for simple weeknight meals.",
    tags: ["Protein", "Quick", "Light"]
  },
  "salmon": {
    difficulty: "Easy",
    prepTime: "25 minutes",
    servings: 3,
    structuredIngredients: [
      { name: "Salmon", quantity: 400, unit: "g" },
      { name: "Lemon", quantity: 1, unit: "piece" }
    ],
    ingredients: "Salmon, lemon, salt, pepper, oil, optional garlic",
    steps: "Season the salmon and cook it in a pan, oven, or air fryer until just done and flaky. Finish with lemon before serving.",
    notes: "A simple salmon base that works well with rice, salad, or vegetables.",
    tags: ["Protein", "Healthy", "Quick"]
  },
  "tofu": {
    difficulty: "Easy",
    prepTime: "20 minutes",
    servings: 3,
    structuredIngredients: [
      { name: "Tofu", quantity: 400, unit: "g" },
      { name: "Soy Sauce", quantity: 1, unit: "tbsp" }
    ],
    ingredients: "Tofu, soy sauce, garlic, oil, salt, pepper, optional vegetables",
    steps: "Press and cube the tofu, then pan-fry or bake it until lightly crisped. Toss with soy sauce and seasonings before serving.",
    notes: "A good vegetarian protein base for rice bowls, stir-fries, or wraps.",
    tags: ["Protein", "Vegetarian", "Quick"]
  },
  "peanut butter banana smoothie": {
    difficulty: "Very Easy",
    prepTime: "5 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Banana", quantity: 1, unit: "piece" },
      { name: "Peanut Butter", quantity: 2, unit: "tbsp" },
      { name: "Milk", quantity: 1, unit: "cup" }
    ],
    ingredients: "Banana, peanut butter, milk, optional oats or ice",
    steps: "Blend everything until smooth and creamy. Add more milk if you want it thinner and serve immediately.",
    notes: "A quick snack or breakfast smoothie with more staying power than fruit alone.",
    tags: ["Drink", "Snack", "Quick"]
  },
  "ice cream": {
    difficulty: "Very Easy",
    prepTime: "5 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Ice Cream", quantity: 2, unit: "cup" }
    ],
    ingredients: "Ice cream",
    steps: "Scoop into bowls or cones and serve immediately.",
    notes: "A simple dessert entry for logging sweet treats.",
    tags: ["Dessert", "Treat", "Sweet"]
  },
  "lassi": {
    difficulty: "Very Easy",
    prepTime: "10 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Yogurt", quantity: 1, unit: "cup" },
      { name: "Sugar", quantity: 2, unit: "tbsp" }
    ],
    ingredients: "Yogurt, water or milk, sugar, optional cardamom or fruit",
    steps: "Blend the yogurt with water or milk and sweetener until smooth and frothy. Serve chilled.",
    notes: "Keep it plain, sweet, or add fruit depending on what kind of lassi you want.",
    tags: ["Drink", "Refreshing", "Traditional"]
  },
  "banana milk": {
    difficulty: "Very Easy",
    prepTime: "5 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Banana", quantity: 1, unit: "piece" },
      { name: "Milk", quantity: 1, unit: "cup" }
    ],
    ingredients: "Banana, milk, optional sugar or honey",
    steps: "Blend the banana with milk until smooth and serve chilled or at room temperature.",
    notes: "A very simple drink that works well as a light breakfast or snack.",
    tags: ["Drink", "Quick", "Breakfast"]
  },
  "fruits": {
    difficulty: "Very Easy",
    prepTime: "5 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Banana", quantity: 1, unit: "piece" },
      { name: "Apple", quantity: 1, unit: "piece" }
    ],
    ingredients: "Any fresh fruit you have, such as banana, apple, berries, melon, or citrus",
    steps: "Wash, peel, or slice the fruit as needed and serve fresh.",
    notes: "A general fresh fruit entry for easy breakfast, snack, or side logging.",
    tags: ["Snack", "Fresh", "Healthy"]
  },
  "boba": {
    difficulty: "Medium",
    prepTime: "25 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Tea", quantity: 1, unit: "cup" },
      { name: "Sugar", quantity: 2, unit: "tbsp" }
    ],
    ingredients: "Tea, milk, tapioca pearls, sugar, ice",
    steps: "Cook the tapioca pearls, prepare the tea base, then combine with milk, sweetener, and ice. Add the pearls at the end and serve with a wide straw.",
    notes: "A fun treat drink rather than an everyday option.",
    tags: ["Drink", "Treat", "Sweet"]
  },
  "chips": {
    difficulty: "Very Easy",
    prepTime: "2 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Chips", quantity: 1, unit: "bag" }
    ],
    ingredients: "Potato chips or your preferred packaged chips",
    steps: "Open and serve.",
    notes: "A simple snack entry for convenience and food logging.",
    tags: ["Snack", "Treat", "Quick"]
  },
  "edamame": {
    difficulty: "Very Easy",
    prepTime: "10 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Edamame", quantity: 2, unit: "cup" }
    ],
    ingredients: "Edamame, salt",
    steps: "Boil, steam, or microwave the edamame until heated through, then season lightly and serve.",
    notes: "A quick high-protein snack or side.",
    tags: ["Snack", "Protein", "Healthy"]
  },
  "pop corn": {
    difficulty: "Very Easy",
    prepTime: "10 minutes",
    servings: 3,
    structuredIngredients: [
      { name: "Pop Corn", quantity: 0.5, unit: "cup" }
    ],
    ingredients: "Popcorn kernels, oil or butter, salt",
    steps: "Pop the kernels on the stovetop, in a popcorn maker, or in the microwave, then season and serve.",
    notes: "A simple snack base that can be kept savory or sweet.",
    tags: ["Snack", "Movie Night", "Quick"]
  },
  "cake": {
    difficulty: "Medium",
    prepTime: "50 minutes",
    servings: 8,
    structuredIngredients: [
      { name: "Flour", quantity: 2, unit: "cup" },
      { name: "Sugar", quantity: 1, unit: "cup" },
      { name: "Eggs", quantity: 2, unit: "piece" }
    ],
    ingredients: "Flour, sugar, eggs, milk, butter or oil, baking powder, flavoring of choice",
    steps: "Mix the batter until smooth, pour into a prepared pan, and bake until set and golden. Cool before slicing.",
    notes: "A general cake entry for dessert or celebration logging.",
    tags: ["Dessert", "Baked", "Treat"]
  },
  "nuts": {
    difficulty: "Very Easy",
    prepTime: "2 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Almonds", quantity: 0.5, unit: "cup" },
      { name: "Walnuts", quantity: 0.25, unit: "cup" },
      { name: "Cashews", quantity: 0.25, unit: "cup" }
    ],
    ingredients: "Mixed nuts such as almonds, walnuts, and cashews",
    steps: "Portion and serve as a snack or topping.",
    notes: "A flexible snack entry that works as-is or over oatmeal and yogurt.",
    tags: ["Snack", "Protein", "Healthy"]
  },
  "cucumber": {
    difficulty: "Very Easy",
    prepTime: "5 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Cucumber", quantity: 1, unit: "piece" },
      { name: "Lemon", quantity: 0.5, unit: "piece" }
    ],
    ingredients: "Cucumber, salt, lemon, optional chili",
    steps: "Slice the cucumber and season it lightly before serving.",
    notes: "A simple fresh snack or side.",
    tags: ["Snack", "Fresh", "Healthy"]
  },
  "carrots": {
    difficulty: "Very Easy",
    prepTime: "5 minutes",
    servings: 2,
    structuredIngredients: [
      { name: "Carrots", quantity: 2, unit: "piece" }
    ],
    ingredients: "Fresh carrots",
    steps: "Wash, peel if needed, slice, and serve.",
    notes: "A simple vegetable snack entry for quick logging.",
    tags: ["Snack", "Fresh", "Healthy"]
  },
  "soda": {
    difficulty: "Very Easy",
    prepTime: "2 minutes",
    servings: 1,
    structuredIngredients: [
      { name: "Soda", quantity: 1, unit: "bottle" }
    ],
    ingredients: "Soda",
    steps: "Chill and serve.",
    notes: "A simple drink entry for logging only, not an everyday nutrition goal item.",
    tags: ["Drink", "Treat", "Low Priority"]
  },
  "breast toast": {
    difficulty: "Very Easy",
    prepTime: "8 minutes",
    servings: 1,
    structuredIngredients: [
      { name: "Bread", quantity: 2, unit: "piece" },
      { name: "Eggs", quantity: 1, unit: "piece" }
    ],
    ingredients: "Bread, egg, butter or oil, salt, pepper",
    steps: "Toast the bread and prepare the egg how you like it. Place the egg over the toast, season lightly, and serve warm.",
    notes: "A simple quick breakfast entry for toast with egg or protein on top.",
    tags: ["Breakfast", "Quick", "Protein"]
  }
};

function getRecipeDefaults(recipeName) {
  return RECIPE_DETAILS_BY_NAME[String(recipeName || "").trim().toLowerCase()] || null;
}

function readStorage(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}


function normalizeImportKey(key) {
  return String(key || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function getImportedCell(row, aliases) {
  for (const alias of aliases) {
    const value = row[normalizeImportKey(alias)];
    if (value !== undefined) {
      return String(value).trim();
    }
  }
  return "";
}

function parseImportNumber(value, fallback = "") {
  if (value === "" || value == null) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseImportTags(value, fallback = []) {
  if (!String(value || "").trim()) return fallback;
  return Array.from(new Set(String(value)
    .split(/[;,|]/)
    .map((tag) => tag.trim())
    .filter(Boolean)));
}

function parseStructuredIngredientsCell(value) {
  const raw = String(value || "").trim();
  if (!raw) return [];

  if (raw.startsWith("[")) {
    try {
      return normalizeStructuredIngredients(JSON.parse(raw));
    } catch (_error) {
      return [];
    }
  }

  return normalizeStructuredIngredients(
    raw
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [name = "", quantity = "", unit = ""] = part.split("|").map((piece) => piece.trim());
        return {
          name,
          quantity: quantity === "" ? "" : Number(quantity),
          unit
        };
      })
  );
}

function parseCSVText(text) {
  const rows = [];
  let currentRow = [];
  let currentCell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      currentRow.push(currentCell);
      if (currentRow.some((cell) => String(cell || "").trim() !== "")) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  currentRow.push(currentCell);
  if (currentRow.some((cell) => String(cell || "").trim() !== "")) {
    rows.push(currentRow);
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => normalizeImportKey(header));
  return rows.slice(1).map((row) => {
    const mapped = {};
    headers.forEach((header, headerIndex) => {
      mapped[header] = String(row[headerIndex] ?? "").trim();
    });
    return mapped;
  }).filter((row) => Object.values(row).some(Boolean));
}

function getDefaultInventoryImportRecord(itemName) {
  return normalizeInventory([{
    itemName,
    category: "Pantry",
    quantity: 0,
    unit: "item",
    desiredAmount: 1,
    thresholdMode: "percent",
    thresholdPercent: 25,
    threshold: 0,
    notes: "",
    priority: "Essential",
    tags: []
  }])[0];
}

function mergeInventoryImportRows(rows, currentItems) {
  const existingByName = new Map(currentItems.map((item) => [item.itemName.trim().toLowerCase(), item]));
  const nextItems = [...currentItems];
  let created = 0;
  let updated = 0;
  let skipped = 0;

  rows.forEach((row) => {
    const itemName = getImportedCell(row, ["item_name", "itemname", "name"]);
    if (!itemName) {
      skipped += 1;
      return;
    }

    const normalizedName = itemName.trim().toLowerCase();
    const existing = existingByName.get(normalizedName);
    const base = existing ? { ...existing } : getDefaultInventoryImportRecord(itemName);

    const category = getImportedCell(row, ["category"]) || base.category;
    const quantity = parseImportNumber(getImportedCell(row, ["quantity"]), base.quantity);
    const unit = getImportedCell(row, ["unit"]) || base.unit;
    const desiredAmount = Math.max(parseImportNumber(getImportedCell(row, ["desired_amount", "desiredamount", "desired"]), base.desiredAmount), 0);
    const thresholdModeRaw = getImportedCell(row, ["threshold_mode", "thresholdmode"]);
    const thresholdMode = thresholdModeRaw ? normalizeThresholdMode(thresholdModeRaw) : base.thresholdMode;
    const importedThresholdUnits = parseImportNumber(getImportedCell(row, ["low_stock_threshold", "lowstockthreshold", "threshold"]), base.threshold);
    const importedThresholdPercentRaw = getImportedCell(row, ["threshold_percent", "thresholdpercent"]);
    const thresholdPercent = thresholdMode === "percent"
      ? Math.max(0, importedThresholdPercentRaw !== ""
          ? Number(importedThresholdPercentRaw)
          : desiredAmount > 0 && importedThresholdUnits !== ""
            ? roundInventoryValue((Number(importedThresholdUnits || 0) / desiredAmount) * 100)
            : Number(base.thresholdPercent || 25))
      : desiredAmount > 0
        ? roundInventoryValue((Number(importedThresholdUnits || 0) / desiredAmount) * 100)
        : Number(base.thresholdPercent || 25);
    const threshold = thresholdMode === "percent"
      ? roundInventoryValue((desiredAmount * thresholdPercent) / 100)
      : Number(importedThresholdUnits || 0);
    const priorityRaw = getImportedCell(row, ["priority"]);
    const tags = parseImportTags(getImportedCell(row, ["tags"]), base.tags || []);
    const notesCell = getImportedCell(row, ["notes"]);
    const nutritionServingAmountCell = getImportedCell(row, ["nutrition_serving_amount", "nutritionservingamount"]);
    const nutritionServingUnitCell = getImportedCell(row, ["nutrition_serving_unit", "nutritionservingunit"]);
    const caloriesCell = getImportedCell(row, ["calories"]);
    const proteinCell = getImportedCell(row, ["protein_g", "proteing"]);
    const carbsCell = getImportedCell(row, ["carbs_g", "carbsg"]);
    const fatCell = getImportedCell(row, ["fat_g", "fatg"]);

    const merged = {
      ...base,
      id: existing?.id || crypto.randomUUID(),
      itemName,
      category,
      quantity,
      unit,
      desiredAmount: desiredAmount > 0 ? desiredAmount : base.desiredAmount,
      thresholdMode,
      thresholdPercent,
      threshold,
      notes: notesCell !== "" ? notesCell : base.notes,
      priority: priorityRaw ? normalizePriority(priorityRaw) : base.priority,
      tags,
      nutritionServingAmount: nutritionServingAmountCell !== "" ? Number(nutritionServingAmountCell) : base.nutritionServingAmount,
      nutritionServingUnit: nutritionServingUnitCell !== "" ? nutritionServingUnitCell : base.nutritionServingUnit,
      calories: caloriesCell !== "" ? Number(caloriesCell) : base.calories,
      proteinG: proteinCell !== "" ? Number(proteinCell) : base.proteinG,
      carbsG: carbsCell !== "" ? Number(carbsCell) : base.carbsG,
      fatG: fatCell !== "" ? Number(fatCell) : base.fatG
    };

    if (existing) {
      const existingIndex = nextItems.findIndex((item) => item.id === existing.id);
      nextItems.splice(existingIndex, 1, merged);
      updated += 1;
    } else {
      nextItems.unshift(merged);
      created += 1;
    }

    existingByName.set(normalizedName, merged);
  });

  return {
    items: normalizeInventory(nextItems),
    created,
    updated,
    skipped
  };
}

function mergeRecipeImportRows(rows, currentRecipes) {
  const existingByName = new Map(currentRecipes.map((recipe) => [recipe.recipeName.trim().toLowerCase(), recipe]));
  const nextRecipes = [...currentRecipes];
  let created = 0;
  let updated = 0;
  let skipped = 0;

  rows.forEach((row) => {
    const recipeName = getImportedCell(row, ["recipe_name", "recipename", "name"]);
    if (!recipeName) {
      skipped += 1;
      return;
    }

    const normalizedName = recipeName.trim().toLowerCase();
    const existing = existingByName.get(normalizedName);
    const structuredIngredientsRaw = getImportedCell(row, ["structured_ingredients", "structuredingredients"]);
    const importedStructuredIngredients = parseStructuredIngredientsCell(structuredIngredientsRaw);
    const importedIngredients = getImportedCell(row, ["ingredients"]);
    const importedTags = parseImportTags(getImportedCell(row, ["tags"]), existing?.tags || []);

    const merged = {
      id: existing?.id || crypto.randomUUID(),
      recipeName,
      category: getImportedCell(row, ["category"]) || existing?.category || "Lunch and Dinner",
      difficulty: getImportedCell(row, ["difficulty"]) || existing?.difficulty || "Easy",
      prepTime: getImportedCell(row, ["prep_time", "preptime"]) || existing?.prepTime || "",
      servings: Math.max(parseImportNumber(getImportedCell(row, ["servings", "serving_count", "servingcount"]), existing?.servings || 1), 1),
      structuredIngredients: importedStructuredIngredients.length ? importedStructuredIngredients : normalizeStructuredIngredients(existing?.structuredIngredients || []),
      ingredients: importedIngredients || (importedStructuredIngredients.length ? importedStructuredIngredients.map((ingredient) => formatStructuredIngredient(ingredient)).join(", ") : existing?.ingredients || ""),
      steps: getImportedCell(row, ["steps"]) || existing?.steps || "",
      notes: getImportedCell(row, ["notes"]) || existing?.notes || "",
      imageUrl: getImportedCell(row, ["image_url", "imageurl"]) || existing?.imageUrl || "",
      tags: importedTags
    };

    if (existing) {
      const existingIndex = nextRecipes.findIndex((recipe) => recipe.id === existing.id);
      nextRecipes.splice(existingIndex, 1, merged);
      updated += 1;
    } else {
      nextRecipes.unshift(merged);
      created += 1;
    }

    existingByName.set(normalizedName, merged);
  });

  return {
    items: normalizeRecipes(nextRecipes),
    created,
    updated,
    skipped
  };
}

function normalizeRecipeCategory(category) {
  if (category === "Lunch" || category === "Dinner") {
    return "Lunch and Dinner";
  }
  if (category === "Snacks") {
    return "Snack";
  }
  return category || "Lunch and Dinner";
}


function toBrowserImageUrl(imagePath) {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("file://") || imagePath.startsWith("data:")) {
    return imagePath;
  }
  try {
    return new URL(imagePath, window.location.href).href;
  } catch (_error) {
    return imagePath;
  }
}

function getRecipeImage(recipeName, category) {
  const normalizedName = (recipeName || "").trim().toLowerCase();
  const matchedPath = RECIPE_IMAGE_BY_NAME[normalizedName] || RECIPE_IMAGE_BY_CATEGORY[category] || "";
  return toBrowserImageUrl(matchedPath);
}

function resolveRecipeImage(recipe) {
  const recipeName = recipe.recipeName || recipe.name || "";
  const category = normalizeRecipeCategory(recipe.category || recipe.type || "");
  const normalizedName = recipeName.trim().toLowerCase();
  const mappedImage = getRecipeImage(recipeName, category);
  const currentImage = recipe.imageUrl || recipe.image || "";
  const notes = String(recipe.notes || "").toLowerCase();
  const hasNamedRecipeImage = Object.prototype.hasOwnProperty.call(RECIPE_IMAGE_BY_NAME, normalizedName);
  const isImportedMenuSeed = notes.includes("imported from your food hub menu list");

  if (!currentImage) {
    return mappedImage;
  }

  const normalizedCurrent = String(currentImage).trim();
  const browserReadyCurrent = toBrowserImageUrl(normalizedCurrent);
  const looksLikeLegacyLocalPath =
    normalizedCurrent.includes("/Downloads/") ||
    normalizedCurrent.startsWith("/Users/") ||
    normalizedCurrent.startsWith("file:///Users/");
  const looksLikeProjectAsset =
    normalizedCurrent.startsWith("./assets/") ||
    normalizedCurrent.includes("/assets/") ||
    browserReadyCurrent.includes("/assets/");

  const looksLikeBlockedRemoteImage =
    normalizedCurrent.includes("century.com.np/") ||
    normalizedCurrent.includes("pinterest.com/") ||
    normalizedCurrent.includes("pinimg.com/") ||
    normalizedCurrent.includes("istockphoto.com/") ||
    normalizedCurrent.includes("shutterstock.com/") ||
    normalizedCurrent.includes("freepik.com/") ||
    normalizedCurrent.includes("magnific.com/") ||
    normalizedCurrent.includes("tiktok.com/");

  const looksLikeDirectImage = /\.(png|jpe?g|webp|gif|svg)(\?|#|$)/i.test(normalizedCurrent) || normalizedCurrent.startsWith("data:");

  if (isImportedMenuSeed && hasNamedRecipeImage && mappedImage) {
    return mappedImage;
  }

  if (looksLikeLegacyLocalPath && mappedImage) {
    return mappedImage;
  }

  if (looksLikeBlockedRemoteImage && mappedImage) {
    return mappedImage;
  }

  if (looksLikeProjectAsset) {
    if (hasNamedRecipeImage) {
      return mappedImage;
    }
    return "";
  }

  if (!looksLikeDirectImage && mappedImage) {
    return mappedImage;
  }

  return browserReadyCurrent;
}

function normalizeRecipes(data) {
  return data.map((recipe) => {
    const recipeName = recipe.recipeName || recipe.name || "";
    const category = normalizeRecipeCategory(recipe.category || recipe.type || "");
    const defaults = getRecipeDefaults(recipeName);
    const rawIngredients = Array.isArray(recipe.ingredients) ? recipe.ingredients.join(", ") : recipe.ingredients || "";
    const rawSteps = recipe.steps || "";
    const rawNotes = recipe.notes || "";
    const rawStructuredIngredients = normalizeStructuredIngredients(recipe.structuredIngredients || recipe.structured_ingredients || []);
    const existingTags = Array.isArray(recipe.tags)
      ? recipe.tags
      : typeof recipe.tags === "string"
        ? recipe.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];
    const isImportedMenuSeed = rawNotes.toLowerCase().includes("imported from your food hub menu list");
    const hasPlaceholderIngredients = !rawIngredients || rawIngredients === "Add ingredients for this dish.";
    const hasPlaceholderSteps = !rawSteps || rawSteps === "Add your cooking steps or preparation notes for this dish.";
    const shouldApplyDefaults = Boolean(defaults) && (isImportedMenuSeed || hasPlaceholderIngredients || hasPlaceholderSteps || rawStructuredIngredients.length === 0);
    const mergedTags = shouldApplyDefaults
      ? Array.from(new Set([...existingTags, ...(defaults.tags || [])]))
      : existingTags;

    return {
      id: recipe.id || crypto.randomUUID(),
      recipeName,
      category,
      difficulty: shouldApplyDefaults && (recipe.difficulty === "Varies" || !recipe.difficulty) ? defaults.difficulty || recipe.difficulty || "Easy" : recipe.difficulty || "Easy",
      prepTime: shouldApplyDefaults && (!recipe.prepTime && !recipe.time || recipe.prepTime === "Varies" || recipe.time === "Varies") ? defaults.prepTime || recipe.prepTime || recipe.time || "" : recipe.prepTime || recipe.time || "",
      servings: shouldApplyDefaults && defaults.servings && Number(recipe.servings || recipe.serving_count || 1) === 1 ? defaults.servings : Math.max(Number(recipe.servings || recipe.serving_count || 1) || 1, 1),
      structuredIngredients: shouldApplyDefaults && rawStructuredIngredients.length === 0 ? normalizeStructuredIngredients(defaults.structuredIngredients || []) : rawStructuredIngredients,
      ingredients: shouldApplyDefaults && hasPlaceholderIngredients ? defaults.ingredients || rawIngredients : rawIngredients,
      steps: shouldApplyDefaults && hasPlaceholderSteps ? defaults.steps || rawSteps : rawSteps,
      notes: shouldApplyDefaults && isImportedMenuSeed ? defaults.notes || rawNotes : rawNotes,
      imageUrl: resolveRecipeImage(recipe),
      tags: mergedTags
    };
  });
}

function mergeSeedRecipes(existingRecipes, seedRecipes) {
  const seen = new Set(existingRecipes.map((recipe) => recipe.recipeName.trim().toLowerCase()));
  const missingSeeds = seedRecipes.filter(
    (recipe) => !seen.has(recipe.recipeName.trim().toLowerCase())
  );
  return [...existingRecipes, ...missingSeeds];
}

function normalizeThresholdMode(mode) {
  return String(mode || "").toLowerCase() === "units" ? "units" : "percent";
}

function roundInventoryValue(value) {
  return Number(Number(value || 0).toFixed(1));
}

function nullableNumber(value) {
  return value === "" || value == null ? null : Number(value);
}

function normalizeInventory(data) {
  return data.map((item) => {
    const quantity = Number(item.quantity || 0);
    const threshold = Number(item.threshold || item.lowStockThreshold || 0);
    const desiredAmount = Number(item.desiredAmount || item.desired_amount || 0);
    const normalizedDesiredAmount =
      desiredAmount > 0
        ? desiredAmount
        : threshold > 0
          ? Math.max(Math.ceil(threshold / 0.25), threshold + 1, quantity, 1)
          : Math.max(Math.ceil(quantity), 1);
    const thresholdMode = normalizeThresholdMode(item.thresholdMode || item.threshold_mode);
    const thresholdPercent =
      thresholdMode === "percent"
        ? Number(item.thresholdPercent || item.threshold_percent || 25)
        : normalizedDesiredAmount > 0
          ? roundInventoryValue((threshold / normalizedDesiredAmount) * 100)
          : 25;

    return {
      id: item.id || crypto.randomUUID(),
      itemName: item.itemName || item.name || "",
      category: item.category || "General",
      quantity,
      unit: item.unit || "item",
      threshold,
      desiredAmount: normalizedDesiredAmount,
      thresholdMode,
      thresholdPercent: Math.max(0, thresholdPercent),
      notes: item.notes || "",
      priority: normalizePriority(item.priority),
      tags: Array.isArray(item.tags)
        ? item.tags
        : typeof item.tags === "string"
          ? item.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : [],
      nutritionServingAmount: item.nutritionServingAmount ?? item.nutrition_serving_amount ?? "",
      nutritionServingUnit: item.nutritionServingUnit ?? item.nutrition_serving_unit ?? "",
      calories: item.calories ?? "",
      proteinG: item.proteinG ?? item.protein_g ?? "",
      carbsG: item.carbsG ?? item.carbs_g ?? "",
      fatG: item.fatG ?? item.fat_g ?? ""
    };
  });
}

function normalizeGrocery(data) {
  return data.map((item) => ({
    id: item.id || crypto.randomUUID(),
    itemName: item.itemName || item.name || "",
    quantity: Number(item.quantity || 1),
    unit: item.unit || "item",
    category: item.category || "General",
    bought: Boolean(item.bought || item.checked),
    source: item.source || "manual",
    linkedInventoryId: item.linkedInventoryId || null,
    suppressed: Boolean(item.suppressed),
    priority: normalizePriority(item.priority)
  }));
}

function getStatus(item) {
  const quantity = Number(item.quantity);
  const threshold = getEffectiveThreshold(item);

  if (quantity === 0) return "Finished";
  if (quantity <= threshold) return "Low Stock";
  return "In Stock";
}

function getPriorityWeight(priority) {
  const normalizedPriority = normalizePriority(priority);
  const weights = {
    "Critical": 4,
    "Essential": 3,
    "Supplementary": 2,
    "Low Priority": 1
  };

  return weights[normalizedPriority] || 2;
}

function getDesiredQuantity(item) {
  const desiredAmount = Number(item.desiredAmount || 0);
  const quantity = Number(item.quantity || 0);
  const threshold = Number(item.threshold || 0);

  if (desiredAmount > 0) return desiredAmount;
  if (threshold <= 0) return Math.max(Math.ceil(quantity), 1);
  return Math.max(Math.ceil(threshold / 0.25), threshold + 1, quantity, 1);
}

function getEffectiveThreshold(item) {
  const desiredQuantity = getDesiredQuantity(item);
  const thresholdMode = normalizeThresholdMode(item.thresholdMode);
  const thresholdPercent = Number(item.thresholdPercent || 0);
  const thresholdUnits = Number(item.threshold || 0);

  if (thresholdMode === "percent") {
    return roundInventoryValue((desiredQuantity * thresholdPercent) / 100);
  }

  return thresholdUnits;
}

function getThresholdPercent(item) {
  const desiredQuantity = getDesiredQuantity(item);
  const threshold = getEffectiveThreshold(item);

  if (desiredQuantity <= 0) return 0;
  return roundInventoryValue((threshold / desiredQuantity) * 100);
}

function getInventoryLevelPercent(item) {
  const quantity = Number(item.quantity || 0);
  const desiredQuantity = getDesiredQuantity(item);

  if (desiredQuantity <= 0) return 0;
  return Math.max(0, Math.round((quantity / desiredQuantity) * 100));
}

function getInventoryDisplayPercent(item) {
  return Math.max(0, Math.min(110, getInventoryLevelPercent(item)));
}

function getThresholdMarkerPercent(item) {
  const threshold = getEffectiveThreshold(item);
  const desiredQuantity = getDesiredQuantity(item);

  if (threshold <= 0 || desiredQuantity <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((threshold / desiredQuantity) * 100)));
}

function getStockPercent(item) {
  const quantity = Number(item.quantity || 0);
  const threshold = getEffectiveThreshold(item);

  if (quantity <= 0) return 0;
  if (threshold <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round((quantity / threshold) * 100)));
}

function getInventoryLevelTone(item) {
  const quantity = Number(item.quantity || 0);
  const threshold = getEffectiveThreshold(item);
  const levelPercent = getInventoryLevelPercent(item);

  if (quantity <= 0) return "empty";
  if (threshold > 0 && quantity <= threshold) return levelPercent <= 15 ? "critical" : "below-threshold";
  if (levelPercent < 70) return "caution";
  if (levelPercent > 100) return "over";
  return "healthy";
}

function getUrgencyTone(item) {
  const priorityWeight = getPriorityWeight(item.priority);
  const stockPercent = getStockPercent(item);

  if (item.status === "Finished") {
    return priorityWeight >= 4 ? "critical" : "high";
  }
  if (priorityWeight >= 4 && stockPercent <= 50) return "critical";
  if (priorityWeight >= 3 && stockPercent <= 60) return "high";
  if (stockPercent <= 80) return "medium";
  return "low";
}

function getItemSubstituteAlertGroup(item) {
  const itemTags = Array.isArray(item?.tags) ? item.tags : [];
  return SUBSTITUTE_ALERT_GROUP_TAGS.find((tag) => itemTags.includes(tag)) || null;
}

function getGroupedAlertItems(items) {
  const grouped = new Map();
  const ungrouped = [];

  items.forEach((item) => {
    const groupTag = getItemSubstituteAlertGroup(item);
    if (!groupTag) {
      ungrouped.push(item);
      return;
    }

    if (!grouped.has(groupTag)) {
      grouped.set(groupTag, []);
    }
    grouped.get(groupTag).push(item);
  });

  const resolvedGroups = [];
  grouped.forEach((groupItems) => {
    const everyItemNeedsAttention = groupItems.every((item) => item.status === "Low Stock" || item.status === "Finished");
    if (everyItemNeedsAttention) {
      resolvedGroups.push(...groupItems);
    }
  });

  return [...ungrouped, ...resolvedGroups];
}

function getShoppingSignal(alertItems) {
  const criticalFinished = alertItems.filter((item) => normalizePriority(item.priority) === "Critical" && item.status === "Finished").length;
  const criticalAlerts = alertItems.filter((item) => normalizePriority(item.priority) === "Critical").length;
  const essentialAlerts = alertItems.filter((item) => normalizePriority(item.priority) === "Essential").length;

  if (criticalFinished >= 1 || criticalAlerts >= 2) {
    return {
      label: "Shop ASAP",
      message: "Critical staples are out or almost gone. This is a strong sign it is time to get groceries now.",
      tone: "critical"
    };
  }

  if (criticalAlerts >= 1 || essentialAlerts >= 3 || alertItems.length >= 4) {
    return {
      label: "Plan a Grocery Run Soon",
      message: "Important pantry items are running low. You should plan a grocery trip soon.",
      tone: "high"
    };
  }

  if (alertItems.length >= 1) {
    return {
      label: "Keep an Eye on Stock",
      message: "A few items need attention, but this does not look urgent yet.",
      tone: "medium"
    };
  }

  return {
    label: "Pantry Looks Good",
    message: "No urgent grocery action is needed right now.",
    tone: "low"
  };
}

function getCurrentDateTimeLocalValue() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

function isSameLocalDay(dateA, dateB = new Date()) {
  const a = new Date(dateA);
  const b = new Date(dateB);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function emptyFoodLog() {
  return {
    recipeName: "",
    servingsEaten: 1,
    consumedAt: getCurrentDateTimeLocalValue(),
    notes: ""
  };
}

function normalizeFoodLog(data) {
  if (!Array.isArray(data)) return [];
  return data
    .map((entry) => ({
      id: entry?.id || crypto.randomUUID(),
      recipeId: entry?.recipeId || "",
      recipeName: entry?.recipeName || entry?.itemName || "",
      servingsEaten: Math.max(Number(entry?.servingsEaten || entry?.servings_eaten || 1) || 1, 1),
      consumedAt: entry?.consumedAt || entry?.consumed_at || getCurrentDateTimeLocalValue(),
      calories: Number(entry?.calories || 0),
      proteinG: Number(entry?.proteinG || entry?.protein_g || 0),
      carbsG: Number(entry?.carbsG || entry?.carbs_g || 0),
      fatG: Number(entry?.fatG || entry?.fat_g || 0),
      notes: entry?.notes || ""
    }))
    .sort((a, b) => new Date(b.consumedAt) - new Date(a.consumedAt));
}

function defaultDailyNutritionGoals() {
  return {
    calories: 2000,
    proteinG: 75,
    carbsG: 250,
    fatG: 70
  };
}

function normalizeDailyNutritionGoals(data) {
  const defaults = defaultDailyNutritionGoals();
  return {
    calories: Math.max(Number(data?.calories ?? defaults.calories) || defaults.calories, 0),
    proteinG: Math.max(Number(data?.proteinG ?? data?.protein_g ?? defaults.proteinG) || defaults.proteinG, 0),
    carbsG: Math.max(Number(data?.carbsG ?? data?.carbs_g ?? defaults.carbsG) || defaults.carbsG, 0),
    fatG: Math.max(Number(data?.fatG ?? data?.fat_g ?? defaults.fatG) || defaults.fatG, 0)
  };
}

function emptyStructuredIngredient() {
  return {
    name: "",
    quantity: "",
    unit: ""
  };
}

function normalizeStructuredIngredients(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      name: String(item?.name || item?.itemName || "").trim(),
      quantity: item?.quantity === "" || item?.quantity == null ? "" : Number(item.quantity),
      unit: String(item?.unit || "").trim()
    }))
    .filter((item) => item.name || item.quantity !== "" || item.unit);
}

function formatStructuredIngredient(item) {
  const quantity = item?.quantity !== "" && item?.quantity != null ? `${item.quantity} ` : "";
  const unit = item?.unit ? `${item.unit} ` : "";
  return `${quantity}${unit}${item?.name || ""}`.trim();
}

function emptyRecipe() {
  return {
    recipeName: "",
    category: "",
    difficulty: "",
    prepTime: "",
    servings: 1,
    structuredIngredients: [emptyStructuredIngredient()],
    ingredients: "",
    steps: "",
    notes: "",
    imageUrl: "",
    tags: ""
  };
}

function emptyInventory() {
  return {
    itemName: "",
    category: "",
    quantity: "",
    unit: "",
    desiredAmount: "",
    thresholdMode: "percent",
    thresholdPercent: 25,
    threshold: 0,
    notes: "",
    priority: "Essential",
    tags: "",
    nutritionServingAmount: "",
    nutritionServingUnit: "",
    calories: "",
    proteinG: "",
    carbsG: "",
    fatG: ""
  };
}

function emptyGrocery() {
  return {
    itemName: "",
    quantity: "",
    unit: "",
    category: "",
    bought: false,
    priority: "Essential"
  };
}

function recipeToRow(recipe, householdId) {
  return {
    id: recipe.id,
    household_id: householdId,
    recipe_name: recipe.recipeName,
    category: recipe.category,
    difficulty: recipe.difficulty,
    prep_time: recipe.prepTime,
    serving_count: Math.max(Number(recipe.servings || 1) || 1, 1),
    structured_ingredients: normalizeStructuredIngredients(recipe.structuredIngredients || []),
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    notes: recipe.notes,
    image_url: recipe.imageUrl || "",
    tags: recipe.tags || []
  };
}

function inventoryToRow(item, householdId) {
  return {
    id: item.id,
    household_id: householdId,
    item_name: item.itemName,
    category: item.category,
    quantity: Number(item.quantity || 0),
    unit: item.unit,
    low_stock_threshold: Number(getEffectiveThreshold(item) || 0),
    desired_amount: Number(item.desiredAmount || 0),
    threshold_mode: normalizeThresholdMode(item.thresholdMode),
    threshold_percent: Number(item.thresholdPercent || 25),
    notes: item.notes,
    priority: normalizePriority(item.priority),
    tags: item.tags || [],
    nutrition_serving_amount: nullableNumber(item.nutritionServingAmount),
    nutrition_serving_unit: item.nutritionServingUnit || null,
    calories: nullableNumber(item.calories),
    protein_g: nullableNumber(item.proteinG),
    carbs_g: nullableNumber(item.carbsG),
    fat_g: nullableNumber(item.fatG)
  };
}

function groceryToRow(item, householdId) {
  return {
    id: item.id,
    household_id: householdId,
    item_name: item.itemName,
    quantity: Number(item.quantity || 1),
    unit: item.unit,
    category: item.category,
    bought: Boolean(item.bought),
    source: item.source || "manual",
    linked_inventory_id: item.linkedInventoryId || null,
    suppressed: Boolean(item.suppressed),
    priority: normalizePriority(item.priority)
  };
}

function foodLogToRow(entry, householdId, userId) {
  return {
    id: entry.id,
    household_id: householdId,
    recipe_id: entry.recipeId || null,
    recipe_name: entry.recipeName,
    servings_eaten: Number(entry.servingsEaten || 1),
    consumed_at: entry.consumedAt,
    calories: Number(entry.calories || 0),
    protein_g: Number(entry.proteinG || 0),
    carbs_g: Number(entry.carbsG || 0),
    fat_g: Number(entry.fatG || 0),
    notes: entry.notes || "",
    logged_by: userId || null
  };
}

function dailyNutritionGoalsToRow(goals, householdId) {
  return {
    household_id: householdId,
    calories_goal: Math.max(Number(goals?.calories || 0) || 0, 0),
    protein_g_goal: Math.max(Number(goals?.proteinG || 0) || 0, 0),
    carbs_g_goal: Math.max(Number(goals?.carbsG || 0) || 0, 0),
    fat_g_goal: Math.max(Number(goals?.fatG || 0) || 0, 0)
  };
}

function normalizeChopboardSession(items) {
  if (!Array.isArray(items)) return [];

  const seenRecipeIds = new Set();

  return items
    .map((item) => ({
      recipeId: item?.recipeId || item?.id || "",
      servings: Math.max(Number(item?.servings) || 1, 1),
      confirmed: Boolean(item?.confirmed),
      addedAt: Number(item?.addedAt) || Date.now()
    }))
    .filter((item) => {
      if (!item.recipeId || seenRecipeIds.has(item.recipeId)) return false;
      seenRecipeIds.add(item.recipeId);
      return true;
    });
}

function normalizeIngredientToken(token) {
  return String(token || "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b\d+(?:[./]\d+)?\b/g, " ")
    .replace(/\b(cup|cups|tbsp|tsp|tablespoon|tablespoons|teaspoon|teaspoons|oz|ounce|ounces|lb|lbs|pound|pounds|g|kg|gram|grams|ml|l|pinch|clove|cloves|slice|slices|piece|pieces|pcs|bunch|bunches|can|cans|jar|jars|box|boxes|bag|bags|carton|cartons|loaf|loaves)\b/g, " ")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\b(and|or|with|for|to|of|fresh|ground|minced|chopped|diced|large|small|medium|optional|taste|needed)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getRecipeIngredientTokens(ingredientsText) {
  return String(ingredientsText || "")
    .split(/[\n,]/)
    .map((token) => normalizeIngredientToken(token))
    .filter(Boolean);
}

function getRecipeIngredientNames(recipe) {
  const structuredNames = normalizeStructuredIngredients(recipe?.structuredIngredients || [])
    .map((ingredient) => normalizeIngredientToken(ingredient.name))
    .filter(Boolean);

  return Array.from(new Set([...structuredNames, ...getRecipeIngredientTokens(recipe?.ingredients)]));
}

function normalizeMeasurementUnit(unit) {
  const normalized = String(unit || "").toLowerCase().trim();
  if (!normalized) return "";
  if (normalized.includes("piece") || normalized === "pcs" || normalized === "pc" || normalized === "item") return "piece";
  if (normalized.includes("clove")) return "clove";
  if (normalized.includes("cup")) return "cup";
  if (normalized.includes("tbsp") || normalized.includes("tablespoon")) return "tbsp";
  if (normalized.includes("tsp") || normalized.includes("teaspoon")) return "tsp";
  if (normalized.includes("kg")) return "kg";
  if (normalized === "g" || normalized.includes(" gram") || normalized.startsWith("g ") || normalized.endsWith(" g") ) return "g";
  if (normalized.includes("oz")) return "oz";
  if (normalized.includes("lb")) return "lb";
  if (normalized.includes("pack")) return "pack";
  if (normalized.includes("bag")) return "bag";
  if (normalized.includes("bottle")) return "bottle";
  if (normalized.includes("jar")) return "jar";
  if (normalized.includes("box")) return "box";
  return normalized;
}

function getRecipeIngredientNameSuggestions(value, inventoryItems) {
  const searchValue = toSearchText(value);
  if (!searchValue) return [];

  return Array.from(new Set(inventoryItems.map((item) => item.itemName)))
    .filter((name) => toSearchText(name).includes(searchValue))
    .slice(0, 8);
}

function getRecipeInventoryMatches(recipe, inventoryItems) {
  const ingredientTokens = getRecipeIngredientNames(recipe);
  const matches = [];
  const seenInventoryIds = new Set();

  inventoryItems.forEach((item) => {
    const itemName = normalizeIngredientToken(item.itemName);
    if (!itemName) return;

    const matched = ingredientTokens.some((token) => token === itemName || token.includes(itemName) || itemName.includes(token));
    if (!matched || seenInventoryIds.has(item.id)) return;

    seenInventoryIds.add(item.id);
    matches.push(item);
  });

  return matches;
}

function hasNutritionData(item) {
  return [item?.calories, item?.proteinG, item?.carbsG, item?.fatG].some((value) => value !== "" && value != null);
}

function formatNutritionNumber(value) {
  if (value === "" || value == null || Number.isNaN(Number(value))) return "-";
  const numericValue = Number(value);
  return Number.isInteger(numericValue) ? String(numericValue) : String(roundInventoryValue(numericValue));
}

function getRecipeNutritionEstimate(recipe, inventoryItems) {
  const structuredIngredients = normalizeStructuredIngredients(recipe?.structuredIngredients || []);
  const structuredMatches = structuredIngredients.map((ingredient) => {
    const inventoryItem = inventoryItems.find((item) => normalizeIngredientToken(item.itemName) === normalizeIngredientToken(ingredient.name));
    if (!inventoryItem || !hasNutritionData(inventoryItem)) {
      return inventoryItem ? { ingredient, inventoryItem, multiplier: 0, counted: false } : { ingredient, inventoryItem: null, multiplier: 0, counted: false };
    }

    const quantity = Number(ingredient.quantity || 0);
    const servingAmount = Number(inventoryItem.nutritionServingAmount || 1) || 1;
    const ingredientUnit = normalizeMeasurementUnit(ingredient.unit);
    const nutritionUnit = normalizeMeasurementUnit(inventoryItem.nutritionServingUnit);
    const multiplier = quantity > 0 && ingredientUnit && nutritionUnit && ingredientUnit === nutritionUnit
      ? quantity / servingAmount
      : 1;

    return { ingredient, inventoryItem, multiplier, counted: true };
  });

  const useStructuredEstimate = structuredIngredients.length > 0;
  const nutritionItems = useStructuredEstimate
    ? structuredMatches.filter((match) => match.counted)
    : getRecipeInventoryMatches(recipe, inventoryItems).filter(hasNutritionData).map((item) => ({ inventoryItem: item, multiplier: 1, counted: true }));
  const matchedItems = useStructuredEstimate
    ? structuredMatches.filter((match) => match.inventoryItem).map((match) => match.inventoryItem)
    : getRecipeInventoryMatches(recipe, inventoryItems);

  const totals = nutritionItems.reduce((accumulator, match) => ({
    calories: accumulator.calories + Number(match.inventoryItem.calories || 0) * match.multiplier,
    proteinG: accumulator.proteinG + Number(match.inventoryItem.proteinG || 0) * match.multiplier,
    carbsG: accumulator.carbsG + Number(match.inventoryItem.carbsG || 0) * match.multiplier,
    fatG: accumulator.fatG + Number(match.inventoryItem.fatG || 0) * match.multiplier
  }), {
    calories: 0,
    proteinG: 0,
    carbsG: 0,
    fatG: 0
  });

  const servings = Math.max(Number(recipe?.servings || 1) || 1, 1);

  return {
    matchedItems,
    nutritionItems,
    servings,
    hasEstimate: nutritionItems.length > 0,
    usesStructuredEstimate: useStructuredEstimate,
    calories: Math.round(totals.calories),
    proteinG: roundInventoryValue(totals.proteinG),
    carbsG: roundInventoryValue(totals.carbsG),
    fatG: roundInventoryValue(totals.fatG),
    caloriesPerServing: Math.round(totals.calories / servings),
    proteinPerServing: roundInventoryValue(totals.proteinG / servings),
    carbsPerServing: roundInventoryValue(totals.carbsG / servings),
    fatPerServing: roundInventoryValue(totals.fatG / servings)
  };
}

function toSearchText(value) {
  return String(value || "").trim().toLowerCase();
}

function toTitleCase(value) {
  return String(value || "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function splitIngredientSuggestions(ingredientsText) {
  return String(ingredientsText || "")
    .split(/[\n,]/)
    .map((token) => normalizeIngredientToken(token))
    .filter(Boolean)
    .map(toTitleCase);
}

function getRecipeSearchBlob(recipe) {
  return [recipe.recipeName, recipe.ingredients, ...(recipe.tags || []), ...normalizeStructuredIngredients(recipe.structuredIngredients || []).map((ingredient) => ingredient.name)].join(" ").toLowerCase();
}

function getRecipeExcludeTerms(recipe) {
  return Array.from(new Set([
    recipe.recipeName,
    ...(recipe.tags || []),
    ...splitIngredientSuggestions(recipe.ingredients),
    ...normalizeStructuredIngredients(recipe.structuredIngredients || []).map((ingredient) => ingredient.name)
  ].map((term) => String(term || "").trim()).filter(Boolean)));
}

function getInventorySearchBlob(item) {
  return [item.itemName, item.category, ...(item.tags || [])].join(" ").toLowerCase();
}

function getInventoryExcludeTerms(item) {
  return Array.from(new Set([
    item.itemName,
    item.category,
    ...(item.tags || [])
  ].map((term) => String(term || "").trim()).filter(Boolean)));
}

function matchesExcludedTerms(blob, excludedTerms) {
  if (!excludedTerms.length) return false;
  return excludedTerms.some((term) => blob.includes(toSearchText(term)));
}

function addUniqueFilterTerm(currentTerms, nextTerm) {
  const cleaned = String(nextTerm || "").trim();
  if (!cleaned) return currentTerms;
  return currentTerms.some((term) => toSearchText(term) === toSearchText(cleaned))
    ? currentTerms
    : [...currentTerms, cleaned];
}

function removeFilterTerm(currentTerms, termToRemove) {
  return currentTerms.filter((term) => toSearchText(term) !== toSearchText(termToRemove));
}

function getSuggestedGroceryQuantity(item) {
  const desiredQuantity = getDesiredQuantity(item);
  const quantity = Number(item.quantity || 0);
  return Math.max(roundInventoryValue(desiredQuantity - quantity), 1);
}

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [recipes, setRecipes] = useState(() =>
    mergeSeedRecipes(
      normalizeRecipes(readStorage(STORAGE_KEYS.recipes, defaultRecipes)),
      normalizeRecipes(defaultRecipes)
    )
  );
  const [deletedRecipes, setDeletedRecipes] = useState(() => normalizeRecipes(readStorage(STORAGE_KEYS.deletedRecipes, [])));
  const [deletedInventory, setDeletedInventory] = useState(() => normalizeInventory(readStorage(STORAGE_KEYS.deletedInventory, [])));
  const [inventory, setInventory] = useState(() => normalizeInventory(readStorage(STORAGE_KEYS.inventory, defaultInventory)));
  const [grocery, setGrocery] = useState(() => normalizeGrocery(readStorage(STORAGE_KEYS.grocery, defaultGrocery)));
  const [chopboardItems, setChopboardItems] = useState(() => normalizeChopboardSession(readStorage(STORAGE_KEYS.chopboard, [])));
  const [foodLog, setFoodLog] = useState(() => normalizeFoodLog(readStorage(STORAGE_KEYS.foodLog, [])));
  const [dailyNutritionGoals, setDailyNutritionGoals] = useState(() => normalizeDailyNutritionGoals(readStorage(STORAGE_KEYS.dailyNutritionGoals, defaultDailyNutritionGoals())));
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification === "undefined" ? "unsupported" : Notification.permission
  );

  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [householdId, setHouseholdId] = useState(null);
  const [isHydratingData, setIsHydratingData] = useState(false);
  const [hasRemoteDataLoaded, setHasRemoteDataLoaded] = useState(false);
  const [remoteLoadError, setRemoteLoadError] = useState("");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });

  const [recipeForm, setRecipeForm] = useState(emptyRecipe());
  const [inventoryForm, setInventoryForm] = useState(emptyInventory());
  const [groceryForm, setGroceryForm] = useState(emptyGrocery());
  const [foodLogForm, setFoodLogForm] = useState(emptyFoodLog());

  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [editingInventoryId, setEditingInventoryId] = useState(null);
  const [editingGroceryId, setEditingGroceryId] = useState(null);
  const [editingFoodLogId, setEditingFoodLogId] = useState(null);
  const [isRecipeFormOpen, setIsRecipeFormOpen] = useState(false);
  const [recipeViewMode, setRecipeViewMode] = useState("text");
  const [isInventoryFormOpen, setIsInventoryFormOpen] = useState(false);
  const [isGroceryFormOpen, setIsGroceryFormOpen] = useState(false);
  const [isFoodLogFormOpen, setIsFoodLogFormOpen] = useState(false);
  const [inventoryImportFeedback, setInventoryImportFeedback] = useState("");
  const [recipeImportFeedback, setRecipeImportFeedback] = useState("");
  const [isInventoryImportHelpOpen, setIsInventoryImportHelpOpen] = useState(false);
  const [isRecipeImportHelpOpen, setIsRecipeImportHelpOpen] = useState(false);
  const [focusedRecipeId, setFocusedRecipeId] = useState(null);
  const [menuSearchFilter, setMenuSearchFilter] = useState("");
  const [menuSearchTerms, setMenuSearchTerms] = useState([]);
  const [menuCategoryFilter, setMenuCategoryFilter] = useState("All");
  const [menuExcludeInput, setMenuExcludeInput] = useState("");
  const [menuExcludedTerms, setMenuExcludedTerms] = useState([]);
  const [recipeCategoryFilter, setRecipeCategoryFilter] = useState("All");
  const [recipeTagFilter, setRecipeTagFilter] = useState("All");
  const [recipeSearchFilter, setRecipeSearchFilter] = useState("");
  const [recipeSearchTerms, setRecipeSearchTerms] = useState([]);
  const [recipeExcludeInput, setRecipeExcludeInput] = useState("");
  const [recipeExcludedTerms, setRecipeExcludedTerms] = useState([]);
  const [inventorySearchFilter, setInventorySearchFilter] = useState("");
  const [inventorySearchTerms, setInventorySearchTerms] = useState([]);
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState("All");
  const [inventoryExcludeInput, setInventoryExcludeInput] = useState("");
  const [inventoryExcludedTerms, setInventoryExcludedTerms] = useState([]);
  const [isShoppingSignalOpen, setIsShoppingSignalOpen] = useState(true);
  const [isLowAlertsOpen, setIsLowAlertsOpen] = useState(true);

  const previousAlertItemsRef = useRef(new Set());
  const remoteSyncTimeoutRef = useRef(null);
  const recipeFormSectionRef = useRef(null);
  const inventoryFormSectionRef = useRef(null);
  const groceryFormSectionRef = useRef(null);
  const foodLogFormSectionRef = useRef(null);
  const recipeImportInputRef = useRef(null);
  const inventoryImportInputRef = useRef(null);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      setCurrentUser(data.session?.user || null);
    });

    const {
      data: { subscription }
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session || null);
      setCurrentUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => writeStorage(STORAGE_KEYS.recipes, recipes), [recipes]);
  useEffect(() => writeStorage(STORAGE_KEYS.deletedRecipes, deletedRecipes), [deletedRecipes]);
  useEffect(() => writeStorage(STORAGE_KEYS.deletedInventory, deletedInventory), [deletedInventory]);
  useEffect(() => writeStorage(STORAGE_KEYS.inventory, inventory), [inventory]);
  useEffect(() => writeStorage(STORAGE_KEYS.grocery, grocery), [grocery]);
  useEffect(() => writeStorage(STORAGE_KEYS.chopboard, chopboardItems), [chopboardItems]);
  useEffect(() => writeStorage(STORAGE_KEYS.foodLog, foodLog), [foodLog]);
  useEffect(() => writeStorage(STORAGE_KEYS.dailyNutritionGoals, dailyNutritionGoals), [dailyNutritionGoals]);

  function scrollToSection(sectionRef) {
    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  useEffect(() => {
    if (!currentUser) {
      setHouseholdId(null);
      setHasRemoteDataLoaded(false);
      setIsHydratingData(false);
      setRemoteLoadError("");
      return;
    }

    let isMounted = true;

    async function hydrateFromSupabase() {
      setIsHydratingData(true);
      setHasRemoteDataLoaded(false);
      setRemoteLoadError("");

      try {
        const { data: profile, error: profileError } = await supabaseClient
          .from("profiles")
          .select("household_id")
          .eq("id", currentUser.id)
          .single();

        if (!isMounted) return;

        if (profileError || !profile?.household_id) {
          console.error("Unable to load household profile", profileError);
          setHouseholdId(null);
          setRemoteLoadError("We could not load your household data from Supabase yet.");
          setHasRemoteDataLoaded(true);
          setIsHydratingData(false);
          return;
        }

        const nextHouseholdId = profile.household_id;
        setHouseholdId(nextHouseholdId);

        const [recipesResponse, inventoryResponse, groceryResponse, foodLogResponse, nutritionGoalsResponse] = await Promise.all([
          supabaseClient
            .from("recipes")
            .select("id, recipe_name, category, difficulty, prep_time, serving_count, structured_ingredients, ingredients, steps, notes, image_url, tags")
            .eq("household_id", nextHouseholdId)
            .order("created_at", { ascending: false }),
          supabaseClient
            .from("inventory_items")
            .select("id, item_name, category, quantity, unit, low_stock_threshold, desired_amount, threshold_mode, threshold_percent, notes, priority, tags, nutrition_serving_amount, nutrition_serving_unit, calories, protein_g, carbs_g, fat_g")
            .eq("household_id", nextHouseholdId)
            .order("created_at", { ascending: false }),
          supabaseClient
            .from("grocery_items")
            .select("id, item_name, quantity, unit, category, bought, source, linked_inventory_id, suppressed, priority")
            .eq("household_id", nextHouseholdId)
            .order("created_at", { ascending: false }),
          supabaseClient
            .from("food_log_entries")
            .select("id, recipe_id, recipe_name, servings_eaten, consumed_at, calories, protein_g, carbs_g, fat_g, notes, logged_by")
            .eq("household_id", nextHouseholdId)
            .order("consumed_at", { ascending: false }),
          supabaseClient
            .from("household_settings")
            .select("household_id, calories_goal, protein_g_goal, carbs_g_goal, fat_g_goal")
            .eq("household_id", nextHouseholdId)
            .maybeSingle()
        ]);

        if (!isMounted) return;

        if (recipesResponse.error || inventoryResponse.error || groceryResponse.error || foodLogResponse.error || nutritionGoalsResponse.error) {
          console.error("Unable to load Supabase household data", recipesResponse.error || inventoryResponse.error || groceryResponse.error || foodLogResponse.error || nutritionGoalsResponse.error);
          setRemoteLoadError("We could not load your shared household data from Supabase.");
          setHasRemoteDataLoaded(true);
          setIsHydratingData(false);
          return;
        }

        const remoteRecipes = normalizeRecipes((recipesResponse.data || []).map((recipe) => ({
          id: recipe.id,
          recipeName: recipe.recipe_name,
          category: recipe.category,
          difficulty: recipe.difficulty,
          prepTime: recipe.prep_time,
          servings: recipe.serving_count,
          structuredIngredients: recipe.structured_ingredients,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          notes: recipe.notes,
          imageUrl: recipe.image_url || "",
          tags: recipe.tags || []
        })));
        const remoteInventory = normalizeInventory((inventoryResponse.data || []).map((item) => ({
          id: item.id,
          itemName: item.item_name,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          threshold: item.low_stock_threshold,
          desiredAmount: item.desired_amount,
          thresholdMode: item.threshold_mode,
          thresholdPercent: item.threshold_percent,
          notes: item.notes,
          priority: item.priority,
          tags: item.tags || [],
          nutritionServingAmount: item.nutrition_serving_amount,
          nutritionServingUnit: item.nutrition_serving_unit,
          calories: item.calories,
          proteinG: item.protein_g,
          carbsG: item.carbs_g,
          fatG: item.fat_g
        })));
        const remoteGrocery = normalizeGrocery((groceryResponse.data || []).map((item) => ({
          id: item.id,
          itemName: item.item_name,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category,
          bought: item.bought,
          source: item.source,
          linkedInventoryId: item.linked_inventory_id,
          suppressed: item.suppressed,
          priority: item.priority
        })));
        const remoteFoodLog = normalizeFoodLog((foodLogResponse.data || []).map((entry) => ({
          id: entry.id,
          recipeId: entry.recipe_id,
          recipeName: entry.recipe_name,
          servingsEaten: entry.servings_eaten,
          consumedAt: entry.consumed_at,
          calories: entry.calories,
          proteinG: entry.protein_g,
          carbsG: entry.carbs_g,
          fatG: entry.fat_g,
          notes: entry.notes || ""
        })));
        const remoteDailyNutritionGoals = nutritionGoalsResponse.data
          ? normalizeDailyNutritionGoals({
              calories: nutritionGoalsResponse.data.calories_goal,
              proteinG: nutritionGoalsResponse.data.protein_g_goal,
              carbsG: nutritionGoalsResponse.data.carbs_g_goal,
              fatG: nutritionGoalsResponse.data.fat_g_goal
            })
          : null;

        const hasRemoteData = remoteRecipes.length > 0 || remoteInventory.length > 0 || remoteGrocery.length > 0 || remoteFoodLog.length > 0 || Boolean(remoteDailyNutritionGoals);

        if (!hasRemoteData) {
          const seededRecipes = mergeSeedRecipes(recipes, normalizeRecipes(defaultRecipes));
          const seededInventory = inventory;
          const seededGrocery = grocery;
          const seededFoodLog = foodLog;
          const seededDailyNutritionGoals = dailyNutritionGoals;

          const seedResponses = await Promise.all([
            seededRecipes.length
              ? supabaseClient.from("recipes").insert(seededRecipes.map((recipe) => recipeToRow(recipe, nextHouseholdId)))
              : Promise.resolve({ error: null }),
            seededInventory.length
              ? supabaseClient.from("inventory_items").insert(seededInventory.map((item) => inventoryToRow(item, nextHouseholdId)))
              : Promise.resolve({ error: null }),
            seededGrocery.length
              ? supabaseClient.from("grocery_items").insert(seededGrocery.map((item) => groceryToRow(item, nextHouseholdId)))
              : Promise.resolve({ error: null }),
            seededFoodLog.length
              ? supabaseClient.from("food_log_entries").insert(seededFoodLog.map((entry) => foodLogToRow(entry, nextHouseholdId, currentUser.id)))
              : Promise.resolve({ error: null }),
            supabaseClient.from("household_settings").upsert(dailyNutritionGoalsToRow(seededDailyNutritionGoals, nextHouseholdId), { onConflict: "household_id" })
          ]);

          const seedError = seedResponses.find((response) => response?.error)?.error;
          if (seedError) {
            console.error("Unable to seed Supabase household data", seedError);
            setRemoteLoadError("We could not seed your starting household data into Supabase.");
            setHasRemoteDataLoaded(true);
            setIsHydratingData(false);
            return;
          }

          setRecipes(seededRecipes);
          setInventory(seededInventory);
          setGrocery(seededGrocery);
          setFoodLog(seededFoodLog);
          setDailyNutritionGoals(seededDailyNutritionGoals);
        } else {
          setRecipes(mergeSeedRecipes(remoteRecipes, normalizeRecipes(defaultRecipes)));
          setInventory(remoteInventory);
          setGrocery(remoteGrocery);
          setFoodLog(remoteFoodLog);
          if (remoteDailyNutritionGoals) {
            setDailyNutritionGoals(remoteDailyNutritionGoals);
          }
        }

        setHasRemoteDataLoaded(true);
        setIsHydratingData(false);
      } catch (error) {
        if (!isMounted) return;
        console.error("Unexpected Supabase hydration error", error);
        setRemoteLoadError("We hit an unexpected loading issue while connecting to Supabase.");
        setHasRemoteDataLoaded(true);
        setIsHydratingData(false);
      }
    }

    hydrateFromSupabase();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || !householdId || !hasRemoteDataLoaded || isHydratingData) {
      return;
    }

    if (remoteSyncTimeoutRef.current) {
      clearTimeout(remoteSyncTimeoutRef.current);
    }

    remoteSyncTimeoutRef.current = setTimeout(async () => {
      const syncTable = async (tableName, rows) => {
        const { data: existingRows, error: existingError } = await supabaseClient
          .from(tableName)
          .select("*")
          .eq("household_id", householdId);

        if (existingError) {
          return { error: existingError };
        }

        const existingById = new Map((existingRows || []).filter((row) => row.id).map((row) => [row.id, row]));
        const existingIds = new Set(existingById.keys());
        const currentIds = new Set(rows.map((row) => row.id).filter(Boolean));
        const idsToDelete = [...existingIds].filter((id) => !currentIds.has(id));

        if (idsToDelete.length) {
          const { error: deleteError } = await supabaseClient
            .from(tableName)
            .delete()
            .in("id", idsToDelete);

          if (deleteError) {
            return { error: deleteError };
          }
        }

        if (!rows.length) {
          return { error: null };
        }

        const rowsToUpsert = rows.filter((row) => {
          const existingRow = existingById.get(row.id);
          if (!existingRow) {
            return true;
          }

          return Object.keys(row).some((key) => {
            const nextValue = row[key];
            const existingValue = existingRow[key];
            return JSON.stringify(nextValue ?? null) !== JSON.stringify(existingValue ?? null);
          });
        });

        if (!rowsToUpsert.length) {
          return { error: null };
        }

        return supabaseClient
          .from(tableName)
          .upsert(rowsToUpsert, { onConflict: "id" });
      };

      const syncResponses = await Promise.all([
        syncTable("recipes", recipes.map((recipe) => recipeToRow(recipe, householdId))),
        syncTable("inventory_items", inventory.map((item) => inventoryToRow(item, householdId))),
        syncTable("grocery_items", grocery.map((item) => groceryToRow(item, householdId))),
        syncTable("food_log_entries", foodLog.map((entry) => foodLogToRow(entry, householdId, currentUser?.id))),
        supabaseClient.from("household_settings").upsert(dailyNutritionGoalsToRow(dailyNutritionGoals, householdId), { onConflict: "household_id" })
      ]);

      const syncError = syncResponses.find((response) => response?.error)?.error;
      if (syncError) {
        console.error("Unable to sync household data to Supabase", syncError);
      }
    }, 500);

    return () => {
      if (remoteSyncTimeoutRef.current) {
        clearTimeout(remoteSyncTimeoutRef.current);
      }
    };
  }, [currentUser, householdId, hasRemoteDataLoaded, isHydratingData, recipes, inventory, grocery, foodLog, dailyNutritionGoals]);

  const inventoryWithStatus = useMemo(
    () => inventory.map((item) => {
      const status = getStatus(item);
      const stockPercent = getStockPercent(item);
      const urgencyTone = getUrgencyTone({ ...item, status });
      const desiredQuantity = getDesiredQuantity(item);
      const inventoryLevelPercent = getInventoryLevelPercent(item);
      const inventoryDisplayPercent = getInventoryDisplayPercent(item);
      const thresholdMarkerPercent = getThresholdMarkerPercent(item);
      const inventoryLevelTone = getInventoryLevelTone(item);
      const effectiveThreshold = getEffectiveThreshold(item);
      const effectiveThresholdPercent = getThresholdPercent(item);
      return {
        ...item,
        priority: normalizePriority(item.priority),
        status,
        stockPercent,
        urgencyTone,
        priorityWeight: getPriorityWeight(item.priority),
        desiredQuantity,
        inventoryLevelPercent,
        inventoryDisplayPercent,
        thresholdMarkerPercent,
        inventoryLevelTone,
        effectiveThreshold,
        effectiveThresholdPercent
      };
    }),
    [inventory]
  );

  const lowStockItems = useMemo(
    () => inventoryWithStatus.filter((item) => item.status === "Low Stock"),
    [inventoryWithStatus]
  );

  const finishedItems = useMemo(
    () => inventoryWithStatus.filter((item) => item.status === "Finished"),
    [inventoryWithStatus]
  );

  const alertItems = useMemo(
    () =>
      getGroupedAlertItems(
        inventoryWithStatus.filter((item) => item.status === "Low Stock" || item.status === "Finished")
      ).sort((a, b) => (b.priorityWeight - a.priorityWeight) || (a.stockPercent - b.stockPercent)),
    [inventoryWithStatus]
  );

  const inStockItems = useMemo(
    () => inventoryWithStatus.filter((item) => item.status === "In Stock"),
    [inventoryWithStatus]
  );

  const weeklyGroceryCount = useMemo(
    () => grocery.filter((item) => !item.bought && !item.suppressed).length,
    [grocery]
  );

  const husbandFriendlyCount = useMemo(
    () => recipes.filter((recipe) => recipe.tags.includes("Husband Friendly")).length,
    [recipes]
  );

  const shoppingSignal = useMemo(() => getShoppingSignal(alertItems), [alertItems]);

  const recipeCategories = useMemo(
    () => ["All", ...new Set(recipes.map((recipe) => recipe.category).filter(Boolean))],
    [recipes]
  );

  const recipeTags = useMemo(
    () => ["All", ...new Set(recipes.flatMap((recipe) => recipe.tags))],
    [recipes]
  );

  const inventoryCategories = useMemo(
    () => ["All", ...new Set(inventoryWithStatus.map((item) => item.category).filter(Boolean))],
    [inventoryWithStatus]
  );

  const menuSearchSuggestions = useMemo(() => {
    const searchText = toSearchText(menuSearchFilter);
    if (!searchText) return [];

    return Array.from(new Set(recipes.flatMap((recipe) => getRecipeExcludeTerms(recipe))))
      .filter((term) => toSearchText(term).includes(searchText))
      .filter((term) => !menuSearchTerms.some((selected) => toSearchText(selected) === toSearchText(term)))
      .slice(0, 8);
  }, [recipes, menuSearchFilter, menuSearchTerms]);

  const recipeSearchSuggestions = useMemo(() => {
    const searchText = toSearchText(recipeSearchFilter);
    if (!searchText) return [];

    return Array.from(new Set(recipes.flatMap((recipe) => getRecipeExcludeTerms(recipe))))
      .filter((term) => toSearchText(term).includes(searchText))
      .filter((term) => !recipeSearchTerms.some((selected) => toSearchText(selected) === toSearchText(term)))
      .slice(0, 8);
  }, [recipes, recipeSearchFilter, recipeSearchTerms]);

  const inventorySearchSuggestions = useMemo(() => {
    const searchText = toSearchText(inventorySearchFilter);
    if (!searchText) return [];

    return Array.from(new Set(inventoryWithStatus.flatMap((item) => getInventoryExcludeTerms(item))))
      .filter((term) => toSearchText(term).includes(searchText))
      .filter((term) => !inventorySearchTerms.some((selected) => toSearchText(selected) === toSearchText(term)))
      .slice(0, 8);
  }, [inventoryWithStatus, inventorySearchFilter, inventorySearchTerms]);

  const menuExcludeSuggestions = useMemo(() => {
    const searchText = toSearchText(menuExcludeInput);
    if (!searchText) return [];

    return Array.from(new Set(recipes.flatMap((recipe) => getRecipeExcludeTerms(recipe))))
      .filter((term) => toSearchText(term).includes(searchText))
      .filter((term) => !menuExcludedTerms.some((selected) => toSearchText(selected) === toSearchText(term)))
      .slice(0, 8);
  }, [recipes, menuExcludeInput, menuExcludedTerms]);

  const recipeExcludeSuggestions = useMemo(() => {
    const searchText = toSearchText(recipeExcludeInput);
    if (!searchText) return [];

    return Array.from(new Set(recipes.flatMap((recipe) => getRecipeExcludeTerms(recipe))))
      .filter((term) => toSearchText(term).includes(searchText))
      .filter((term) => !recipeExcludedTerms.some((selected) => toSearchText(selected) === toSearchText(term)))
      .slice(0, 8);
  }, [recipes, recipeExcludeInput, recipeExcludedTerms]);

  const inventoryExcludeSuggestions = useMemo(() => {
    const searchText = toSearchText(inventoryExcludeInput);
    if (!searchText) return [];

    return Array.from(new Set(inventoryWithStatus.flatMap((item) => getInventoryExcludeTerms(item))))
      .filter((term) => toSearchText(term).includes(searchText))
      .filter((term) => !inventoryExcludedTerms.some((selected) => toSearchText(selected) === toSearchText(term)))
      .slice(0, 8);
  }, [inventoryWithStatus, inventoryExcludeInput, inventoryExcludedTerms]);

  const groceryItemSuggestions = useMemo(() => {
    const searchText = toSearchText(groceryForm.itemName);
    if (!searchText) return [];

    return inventoryWithStatus
      .filter((item) => toSearchText(item.itemName).includes(searchText))
      .map((item) => item.itemName)
      .filter((name, index, array) => array.findIndex((entry) => toSearchText(entry) === toSearchText(name)) === index)
      .slice(0, 8);
  }, [inventoryWithStatus, groceryForm.itemName]);

  const filteredMenuRecipes = useMemo(
    () =>
      recipes.filter((recipe) => {
        const categoryMatch = menuCategoryFilter === "All" || recipe.category === menuCategoryFilter;
        const searchText = toSearchText(menuSearchFilter);
        const searchBlob = getRecipeSearchBlob(recipe);
        const searchMatch = !searchText || searchBlob.includes(searchText);
        const chipMatch = menuSearchTerms.every((term) => searchBlob.includes(toSearchText(term)));
        const excluded = matchesExcludedTerms(searchBlob, menuExcludedTerms);
        return categoryMatch && searchMatch && chipMatch && !excluded;
      }),
    [recipes, menuCategoryFilter, menuSearchFilter, menuSearchTerms, menuExcludedTerms]
  );

  const chopboardSelectionMap = useMemo(
    () => new Map(chopboardItems.map((item) => [item.recipeId, item])),
    [chopboardItems]
  );

  const displayedRecipes = useMemo(() => {
    const filtered = recipes.filter((recipe) => {
      const categoryMatch = recipeCategoryFilter === "All" || recipe.category === recipeCategoryFilter;
      const tagMatch = recipeTagFilter === "All" || recipe.tags.includes(recipeTagFilter);
      const searchText = toSearchText(recipeSearchFilter);
      const searchBlob = getRecipeSearchBlob(recipe);
      const searchMatch = !searchText || searchBlob.includes(searchText);
      const chipMatch = recipeSearchTerms.every((term) => searchBlob.includes(toSearchText(term)));
      const excluded = matchesExcludedTerms(searchBlob, recipeExcludedTerms);
      return categoryMatch && tagMatch && searchMatch && chipMatch && !excluded;
    });

    if (!focusedRecipeId) return filtered;
    const focused = filtered.find((recipe) => recipe.id === focusedRecipeId);
    if (!focused) return filtered;
    return [focused, ...filtered.filter((recipe) => recipe.id !== focusedRecipeId)];
  }, [recipes, focusedRecipeId, recipeCategoryFilter, recipeTagFilter, recipeSearchFilter, recipeSearchTerms, recipeExcludedTerms]);

  const filteredInventoryItems = useMemo(
    () => inventoryWithStatus.filter((item) => {
      const categoryMatch = inventoryCategoryFilter === "All" || item.category === inventoryCategoryFilter;
      const searchText = toSearchText(inventorySearchFilter);
      const searchBlob = getInventorySearchBlob(item);
      const searchMatch = !searchText || searchBlob.includes(searchText);
      const chipMatch = inventorySearchTerms.every((term) => searchBlob.includes(toSearchText(term)));
      const excluded = matchesExcludedTerms(searchBlob, inventoryExcludedTerms);
      return categoryMatch && searchMatch && chipMatch && !excluded;
    }),
    [inventoryWithStatus, inventoryCategoryFilter, inventorySearchFilter, inventorySearchTerms, inventoryExcludedTerms]
  );

  const chopboardSessionItems = useMemo(
    () =>
      chopboardItems
        .map((sessionItem) => {
          const recipe = recipes.find((entry) => entry.id === sessionItem.recipeId);
          if (!recipe) return null;

          const matchedInventoryItems = getRecipeInventoryMatches(recipe, inventoryWithStatus);
          const reducibleInventoryItems = matchedInventoryItems.filter((item) => item.status !== "Finished" && Number(item.quantity || 0) > 0);

          return {
            ...sessionItem,
            recipe,
            matchedInventoryItems,
            reducibleInventoryItems
          };
        })
        .filter(Boolean),
    [chopboardItems, recipes, inventoryWithStatus]
  );

  const allChopboardConfirmed = chopboardSessionItems.length > 0 && chopboardSessionItems.every((item) => item.confirmed);
  const chopboardReducibleCount = chopboardSessionItems.reduce((total, item) => total + item.reducibleInventoryItems.length, 0);

  const lowStockSuggestions = useMemo(() => {
    const suppressedLinks = new Set(
      grocery
        .filter((item) => item.suppressed)
        .map((item) => item.linkedInventoryId)
        .filter(Boolean)
    );

    return alertItems.filter((item) => !suppressedLinks.has(item.id));
  }, [alertItems, grocery]);

  useEffect(() => {
    if (!alertItems.length) return;

    setGrocery((current) => {
      const alertMap = new Map(alertItems.map((item) => [item.id, item]));
      let changed = false;

      const next = current.map((item) => {
        if (item.source !== "low-stock" || !item.linkedInventoryId || item.bought || item.suppressed) {
          return item;
        }

        const alertItem = alertMap.get(item.linkedInventoryId);
        if (!alertItem) return item;

        const suggestedQuantity = getSuggestedGroceryQuantity(alertItem);
        if (
          Number(item.quantity) === suggestedQuantity &&
          item.unit === (alertItem.unit || "item") &&
          item.category === (alertItem.category || "Pantry") &&
          item.priority === (alertItem.priority || "Essential")
        ) {
          return item;
        }

        changed = true;
        return {
          ...item,
          itemName: alertItem.itemName,
          quantity: suggestedQuantity,
          unit: alertItem.unit || "item",
          category: alertItem.category || "Pantry",
          priority: alertItem.priority || "Essential"
        };
      });

      const activeLinks = new Set(
        next.filter((item) => !item.suppressed).map((item) => item.linkedInventoryId).filter(Boolean)
      );
      const suppressedLinks = new Set(
        next.filter((item) => item.suppressed).map((item) => item.linkedInventoryId).filter(Boolean)
      );

      const additions = alertItems
        .filter((item) => !activeLinks.has(item.id) && !suppressedLinks.has(item.id))
        .map((item) => ({
          id: crypto.randomUUID(),
          itemName: item.itemName,
          quantity: getSuggestedGroceryQuantity(item),
          unit: item.unit || "item",
          category: item.category || "Pantry",
          bought: false,
          source: "low-stock",
          linkedInventoryId: item.id,
          suppressed: false,
          priority: item.priority || "Essential"
        }));

      if (!changed && !additions.length) return current;
      return [...additions, ...next];
    });
  }, [alertItems]);

  useEffect(() => {
    setGrocery((current) => {
      const alertIds = new Set(alertItems.map((item) => item.id));
      const next = current.filter((item) => !(item.suppressed && item.linkedInventoryId && !alertIds.has(item.linkedInventoryId)));
      return next.length === current.length ? current : next;
    });

    const currentAlertItems = new Set(alertItems.map((item) => item.id));
    const newlyAlerted = alertItems.filter((item) => !previousAlertItemsRef.current.has(item.id));

    if (
      newlyAlerted.length > 0 &&
      typeof Notification !== "undefined" &&
      Notification.permission === "granted"
    ) {
      newlyAlerted.forEach((item) => {
        new Notification("Kitchen Companion", {
          body: `${item.itemName} needs restocking and was added to your grocery list.`,
          tag: `inventory-alert-${item.id}`
        });
      });
    }

    previousAlertItemsRef.current = currentAlertItems;
  }, [alertItems]);

  async function signInWithPassword(email, password) {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert(error.message);
    }
  }

  async function signOutUser() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      alert(error.message);
    }
  }

  async function handleSignIn(event) {
    event.preventDefault();
    await signInWithPassword(authForm.email, authForm.password);
    setAuthForm((current) => ({ ...current, password: "" }));
  }

  function requestNotifications() {
    if (typeof Notification === "undefined") {
      setNotificationPermission("unsupported");
      return;
    }

    Notification.requestPermission().then((permission) => {
      setNotificationPermission(permission);
    });
  }

  function resetRecipeForm() {
    setEditingRecipeId(null);
    setRecipeForm(emptyRecipe());
    setIsRecipeFormOpen(false);
  }

  function resetInventoryForm() {
    setEditingInventoryId(null);
    setInventoryForm(emptyInventory());
    setIsInventoryFormOpen(false);
  }

  function resetGroceryForm() {
    setEditingGroceryId(null);
    setGroceryForm(emptyGrocery());
    setIsGroceryFormOpen(false);
  }

  function resetFoodLogForm() {
    setEditingFoodLogId(null);
    setFoodLogForm(emptyFoodLog());
    setIsFoodLogFormOpen(false);
  }


  async function importInventoryCSV(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const rows = parseCSVText(await file.text());
      if (!rows.length) {
        throw new Error("No usable CSV rows were found.");
      }
      const result = mergeInventoryImportRows(rows, inventory);
      setInventory(result.items);
      setInventoryImportFeedback(
        "Imported " +
          (result.created + result.updated) +
          " inventory item" +
          (result.created + result.updated !== 1 ? "s" : "") +
          " (" +
          result.created +
          " new, " +
          result.updated +
          " updated" +
          (result.skipped ? ", " + result.skipped + " skipped" : "") +
          ")."
      );
    } catch (error) {
      console.error("Inventory CSV import failed", error);
      setInventoryImportFeedback("Inventory import failed: " + (error.message || "Please check the CSV format and try again."));
    } finally {
      event.target.value = "";
    }
  }

  async function importRecipeCSV(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const rows = parseCSVText(await file.text());
      if (!rows.length) {
        throw new Error("No usable CSV rows were found.");
      }
      const result = mergeRecipeImportRows(rows, recipes);
      setRecipes(result.items);
      setRecipeImportFeedback(
        "Imported " +
          (result.created + result.updated) +
          " recipe" +
          (result.created + result.updated !== 1 ? "s" : "") +
          " (" +
          result.created +
          " new, " +
          result.updated +
          " updated" +
          (result.skipped ? ", " + result.skipped + " skipped" : "") +
          ")."
      );
    } catch (error) {
      console.error("Recipe CSV import failed", error);
      setRecipeImportFeedback("Recipe import failed: " + (error.message || "Please check the CSV format and try again."));
    } finally {
      event.target.value = "";
    }
  }

  function saveRecipe(event) {
    event.preventDefault();
    if (!recipeForm.category) {
      alert("Please choose a category for the recipe.");
      return;
    }
    const normalizedName = recipeForm.recipeName.trim().toLowerCase();
    const duplicateRecipe = recipes.find(
      (recipe) => recipe.id !== editingRecipeId && recipe.recipeName.trim().toLowerCase() === normalizedName
    );

    if (duplicateRecipe) {
      alert("A recipe with that name already exists. Please edit the existing recipe instead of adding a duplicate.");
      return;
    }

    const normalizedStructuredIngredients = normalizeStructuredIngredients(recipeForm.structuredIngredients);
    const normalized = {
      ...recipeForm,
      servings: Math.max(Number(recipeForm.servings || 1) || 1, 1),
      structuredIngredients: normalizedStructuredIngredients,
      ingredients: recipeForm.ingredients.trim() || normalizedStructuredIngredients.map((ingredient) => formatStructuredIngredient(ingredient)).join(", "),
      tags: recipeForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
    };

    if (editingRecipeId) {
      setRecipes((current) =>
        current.map((recipe) =>
          recipe.id === editingRecipeId ? { ...normalized, id: editingRecipeId } : recipe
        )
      );
    } else {
      setRecipes((current) => [{ ...normalized, id: crypto.randomUUID() }, ...current]);
    }

    resetRecipeForm();
  }

  function saveFoodLog(event) {
    event.preventDefault();
    const matchedRecipe = recipes.find((recipe) => recipe.recipeName === foodLogForm.recipeName);
    if (!matchedRecipe) {
      alert("Please choose a recipe to log.");
      return;
    }

    const estimate = getRecipeNutritionEstimate(matchedRecipe, inventoryWithStatus);
    const servingsEaten = Math.max(Number(foodLogForm.servingsEaten || 1) || 1, 1);
    const normalized = {
      recipeId: matchedRecipe.id,
      recipeName: matchedRecipe.recipeName,
      servingsEaten,
      consumedAt: foodLogForm.consumedAt || getCurrentDateTimeLocalValue(),
      calories: Math.round((estimate.caloriesPerServing || 0) * servingsEaten),
      proteinG: roundInventoryValue((estimate.proteinPerServing || 0) * servingsEaten),
      carbsG: roundInventoryValue((estimate.carbsPerServing || 0) * servingsEaten),
      fatG: roundInventoryValue((estimate.fatPerServing || 0) * servingsEaten),
      notes: foodLogForm.notes.trim()
    };

    if (editingFoodLogId) {
      setFoodLog((current) => normalizeFoodLog(current.map((entry) => entry.id === editingFoodLogId ? { ...normalized, id: editingFoodLogId } : entry)));
    } else {
      setFoodLog((current) => normalizeFoodLog([{ ...normalized, id: crypto.randomUUID() }, ...current]));
    }

    resetFoodLogForm();
  }

  function saveInventory(event) {
    event.preventDefault();
    if (!inventoryForm.category) {
      alert("Please choose a category for the inventory item.");
      return;
    }
    if (Number(inventoryForm.desiredAmount) <= 0) {
      alert("Please set the desired amount for this inventory item.");
      return;
    }

    const normalizedThresholdMode = normalizeThresholdMode(inventoryForm.thresholdMode);
    const desiredAmount = Number(inventoryForm.desiredAmount);
    const thresholdPercent = normalizedThresholdMode === "percent"
      ? Math.max(0, Number(inventoryForm.thresholdPercent || 0))
      : desiredAmount > 0
        ? roundInventoryValue((Number(inventoryForm.threshold || 0) / desiredAmount) * 100)
        : 0;
    const thresholdUnits = normalizedThresholdMode === "percent"
      ? roundInventoryValue((desiredAmount * thresholdPercent) / 100)
      : Number(inventoryForm.threshold || 0);

    const normalized = {
      ...inventoryForm,
      quantity: Number(inventoryForm.quantity),
      desiredAmount,
      thresholdMode: normalizedThresholdMode,
      thresholdPercent,
      threshold: thresholdUnits,
      priority: inventoryForm.priority || "Essential",
      tags: inventoryForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      nutritionServingAmount: inventoryForm.nutritionServingAmount === "" ? "" : Number(inventoryForm.nutritionServingAmount),
      nutritionServingUnit: inventoryForm.nutritionServingUnit.trim(),
      calories: inventoryForm.calories === "" ? "" : Number(inventoryForm.calories),
      proteinG: inventoryForm.proteinG === "" ? "" : Number(inventoryForm.proteinG),
      carbsG: inventoryForm.carbsG === "" ? "" : Number(inventoryForm.carbsG),
      fatG: inventoryForm.fatG === "" ? "" : Number(inventoryForm.fatG)
    };

    if (editingInventoryId) {
      setInventory((current) =>
        current.map((item) =>
          item.id === editingInventoryId ? { ...normalized, id: editingInventoryId } : item
        )
      );
    } else {
      setInventory((current) => {
        const duplicateItem = current.find(
          (item) => item.itemName.trim().toLowerCase() === normalized.itemName.trim().toLowerCase()
        );

        if (!duplicateItem) {
          return [{ ...normalized, id: crypto.randomUUID() }, ...current];
        }

        return current.map((item) =>
          item.id === duplicateItem.id
            ? {
                ...item,
                category: normalized.category || item.category,
                quantity: Number(item.quantity || 0) + Number(normalized.quantity || 0),
                unit: normalized.unit || item.unit,
                threshold: Math.max(Number(item.threshold || 0), Number(normalized.threshold || 0)),
                desiredAmount: normalized.desiredAmount || item.desiredAmount,
                thresholdMode: normalized.thresholdMode || item.thresholdMode,
                thresholdPercent: normalized.thresholdPercent || item.thresholdPercent,
                notes: normalized.notes || item.notes,
                priority: normalized.priority || item.priority,
                tags: Array.from(new Set([...(item.tags || []), ...(normalized.tags || [])])),
                nutritionServingAmount: normalized.nutritionServingAmount !== "" ? normalized.nutritionServingAmount : item.nutritionServingAmount,
                nutritionServingUnit: normalized.nutritionServingUnit || item.nutritionServingUnit,
                calories: normalized.calories !== "" ? normalized.calories : item.calories,
                proteinG: normalized.proteinG !== "" ? normalized.proteinG : item.proteinG,
                carbsG: normalized.carbsG !== "" ? normalized.carbsG : item.carbsG,
                fatG: normalized.fatG !== "" ? normalized.fatG : item.fatG
              }
            : item
        );
      });
    }

    resetInventoryForm();
  }

  function saveGrocery(event) {
    event.preventDefault();
    if (!groceryForm.category) {
      alert("Please choose a category for the grocery item.");
      return;
    }
    const existing = grocery.find((item) => item.id === editingGroceryId);
    const normalized = {
      ...groceryForm,
      quantity: Number(groceryForm.quantity),
      bought: groceryForm.bought,
      source: existing?.source || "manual",
      linkedInventoryId: existing?.linkedInventoryId || null,
      suppressed: existing?.suppressed || false,
      priority: groceryForm.priority || existing?.priority || "Essential"
    };

    if (editingGroceryId) {
      setGrocery((current) =>
        current.map((item) =>
          item.id === editingGroceryId ? { ...normalized, id: editingGroceryId } : item
        )
      );
    } else {
      setGrocery((current) => {
        const duplicateItem = current.find(
          (item) =>
            !item.suppressed &&
            item.itemName.trim().toLowerCase() === normalized.itemName.trim().toLowerCase() &&
            item.bought === normalized.bought
        );

        if (!duplicateItem) {
          return [{ ...normalized, id: crypto.randomUUID() }, ...current];
        }

        return current.map((item) =>
          item.id === duplicateItem.id
            ? {
                ...item,
                quantity: Number(item.quantity || 0) + Number(normalized.quantity || 0),
                unit: normalized.unit || item.unit,
                category: normalized.category || item.category,
                priority: normalized.priority || item.priority,
                bought: normalized.bought,
                suppressed: false
              }
            : item
        );
      });
    }

    resetGroceryForm();
  }

  function startRecipeEdit(recipe) {
    setEditingRecipeId(recipe.id);
    setRecipeForm({
      ...recipe,
      servings: recipe.servings || 1,
      structuredIngredients: normalizeStructuredIngredients(recipe.structuredIngredients || []).length
        ? normalizeStructuredIngredients(recipe.structuredIngredients || [])
        : [emptyStructuredIngredient()],
      tags: recipe.tags.join(", ")
    });
    setIsRecipeFormOpen(true);
    setActiveTab("recipes");
    scrollToSection(recipeFormSectionRef);
  }

  function startFoodLogEdit(entry) {
    setEditingFoodLogId(entry.id);
    setFoodLogForm({
      recipeName: entry.recipeName,
      servingsEaten: entry.servingsEaten,
      consumedAt: entry.consumedAt,
      notes: entry.notes || ""
    });
    setIsFoodLogFormOpen(true);
    setActiveTab("food-log");
    scrollToSection(foodLogFormSectionRef);
  }

  function deleteFoodLog(id) {
    setFoodLog((current) => current.filter((entry) => entry.id !== id));
    if (editingFoodLogId === id) {
      resetFoodLogForm();
    }
  }

  function startInventoryEdit(item) {
    setEditingInventoryId(item.id);
    setInventoryForm({
      itemName: item.itemName,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      desiredAmount: item.desiredAmount,
      thresholdMode: item.thresholdMode || "percent",
      thresholdPercent: item.thresholdPercent ?? 25,
      threshold: item.threshold,
      notes: item.notes,
      priority: item.priority || "Essential",
      tags: (item.tags || []).join(", "),
      nutritionServingAmount: item.nutritionServingAmount ?? "",
      nutritionServingUnit: item.nutritionServingUnit || "",
      calories: item.calories ?? "",
      proteinG: item.proteinG ?? "",
      carbsG: item.carbsG ?? "",
      fatG: item.fatG ?? ""
    });
    setIsInventoryFormOpen(true);
    setActiveTab("inventory");
    scrollToSection(inventoryFormSectionRef);
  }

  function applyInventoryItemToGroceryForm(itemName) {
    const matchedInventoryItem = inventoryWithStatus.find(
      (item) => toSearchText(item.itemName) === toSearchText(itemName)
    );

    if (!matchedInventoryItem) {
      setGroceryForm((current) => ({ ...current, itemName }));
      return;
    }

    setGroceryForm((current) => ({
      ...current,
      itemName: matchedInventoryItem.itemName,
      unit: matchedInventoryItem.unit || current.unit,
      category: matchedInventoryItem.category || current.category,
      priority: matchedInventoryItem.priority || current.priority
    }));
  }

  function startGroceryEdit(item) {
    setEditingGroceryId(item.id);
    setGroceryForm({
      itemName: item.itemName,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      bought: item.bought,
      priority: item.priority || "Essential"
    });
    setIsGroceryFormOpen(true);
    setActiveTab("grocery");
    scrollToSection(groceryFormSectionRef);
  }

  function deleteRecipe(id) {
    const target = recipes.find((item) => item.id === id);
    if (!target) return;

    setDeletedRecipes((current) => [target, ...current.filter((item) => item.id !== id)]);
    setRecipes((current) => current.filter((item) => item.id !== id));
    if (editingRecipeId === id) resetRecipeForm();
  }

  function restoreRecipe(id) {
    const target = deletedRecipes.find((item) => item.id === id);
    if (!target) return;

    setRecipes((current) => [target, ...current.filter((item) => item.id !== id)]);
    setDeletedRecipes((current) => current.filter((item) => item.id !== id));
  }

  function permanentlyDeleteRecipe(id) {
    setDeletedRecipes((current) => current.filter((item) => item.id !== id));
  }

  function deleteInventory(id) {
    const target = inventory.find((item) => item.id === id);
    if (!target) return;

    setDeletedInventory((current) => [target, ...current.filter((item) => item.id !== id)]);
    setInventory((current) => current.filter((item) => item.id !== id));
    setGrocery((current) => current.filter((item) => item.linkedInventoryId !== id));
    if (editingInventoryId === id) resetInventoryForm();
  }

  function restoreInventory(id) {
    const target = deletedInventory.find((item) => item.id === id);
    if (!target) return;

    setInventory((current) => [target, ...current.filter((item) => item.id !== id)]);
    setDeletedInventory((current) => current.filter((item) => item.id !== id));
  }

  function permanentlyDeleteInventory(id) {
    setDeletedInventory((current) => current.filter((item) => item.id !== id));
  }

  function deleteGrocery(id) {
    setGrocery((current) => {
      const target = current.find((item) => item.id === id);
      if (!target) return current;

      if (target.linkedInventoryId) {
        return current.map((item) =>
          item.id === id
            ? { ...item, bought: false, suppressed: true }
            : item
        );
      }

      return current.filter((item) => item.id !== id);
    });

    if (editingGroceryId === id) {
      resetGroceryForm();
    }
  }

  function addSingleLowStockItem(item) {
    setGrocery((current) => {
      const existing = current.find((entry) => entry.linkedInventoryId === item.id);

      if (existing) {
        return current.map((entry) =>
          entry.id === existing.id
            ? {
                ...entry,
                itemName: item.itemName,
                quantity: getSuggestedGroceryQuantity(item),
                unit: item.unit || "item",
                category: item.category || "Pantry",
                priority: item.priority || "Essential",
                bought: false,
                suppressed: false,
                source: "low-stock"
              }
            : entry
        );
      }

      return [
        {
          id: crypto.randomUUID(),
          itemName: item.itemName,
          quantity: getSuggestedGroceryQuantity(item),
          unit: item.unit || "item",
          category: item.category || "Pantry",
          bought: false,
          source: "low-stock",
          linkedInventoryId: item.id,
          suppressed: false,
          priority: item.priority || "Essential"
        },
        ...current.filter((entry) => entry.linkedInventoryId !== item.id || !entry.suppressed)
      ];
    });
  }

  function addLowStockItemsToGrocery() {
    alertItems.forEach(addSingleLowStockItem);
    setActiveTab("grocery");
  }

  function toggleGroceryBought(id) {
    setGrocery((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        return { ...item, bought: !item.bought };
      })
    );
  }

  function updateGroceryQuantity(id, nextQuantity) {
    setGrocery((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(Number(nextQuantity) || 0, 0) }
          : item
      )
    );
  }

  function markRestocked(groceryItem) {
    setInventory((current) => {
      const linked = groceryItem.linkedInventoryId
        ? current.find((item) => item.id === groceryItem.linkedInventoryId)
        : current.find((item) => item.itemName.toLowerCase() === groceryItem.itemName.toLowerCase());

      if (!linked) {
        return [
          {
            id: crypto.randomUUID(),
            itemName: groceryItem.itemName,
            category: groceryItem.category || "General",
            quantity: Math.max(Number(groceryItem.quantity) || 1, 1),
            unit: groceryItem.unit || "item",
            desiredAmount: Math.max(Number(groceryItem.quantity) || 1, 1),
            thresholdMode: "percent",
            thresholdPercent: 25,
            threshold: roundInventoryValue(Math.max(Number(groceryItem.quantity) || 1, 1) * 0.25),
            notes: "Restocked from grocery",
            priority: groceryItem.priority || "Essential",
            tags: []
          },
          ...current
        ];
      }

      return current.map((item) =>
        item.id === linked.id
          ? {
              ...item,
              quantity: Number(item.quantity || 0) + Math.max(Number(groceryItem.quantity) || 1, 1),
              unit: groceryItem.unit || item.unit,
              category: groceryItem.category || item.category,
              notes: item.notes,
              priority: groceryItem.priority || item.priority
            }
          : item
      );
    });

    setGrocery((current) => current.map((item) =>
      item.id === groceryItem.id
        ? { ...item, bought: true, suppressed: true }
        : item
    ));
  }

  function openRecipeFromMenu(recipe) {
    setFocusedRecipeId(recipe.id);
    setRecipeViewMode("text");
    setActiveTab("recipes");
  }

  function addRecipeToChopboard(recipe) {
    setChopboardItems((current) => {
      const existing = current.find((item) => item.recipeId === recipe.id);
      if (existing) return current;

      return [
        {
          recipeId: recipe.id,
          servings: 1,
          confirmed: false,
          addedAt: Date.now()
        },
        ...current
      ];
    });
  }

  function updateChopboardServings(recipeId, servings) {
    setChopboardItems((current) =>
      current.map((item) =>
        item.recipeId === recipeId
          ? { ...item, servings: Math.max(Number(servings) || 1, 1), confirmed: false }
          : item
      )
    );
  }

  function toggleChopboardConfirm(recipeId) {
    setChopboardItems((current) =>
      current.map((item) =>
        item.recipeId === recipeId
          ? { ...item, confirmed: !item.confirmed }
          : item
      )
    );
  }

  function removeFromChopboard(recipeId) {
    setChopboardItems((current) => current.filter((item) => item.recipeId !== recipeId));
  }

  function closeChopboardSession() {
    if (!chopboardSessionItems.length) {
      alert("Your Chopboard is empty right now.");
      return;
    }

    if (!allChopboardConfirmed) {
      alert("Please confirm every Chopboard item before closing the session.");
      return;
    }

    const reductions = new Map();

    chopboardSessionItems.forEach((sessionItem) => {
      sessionItem.reducibleInventoryItems.forEach((inventoryItem) => {
        reductions.set(
          inventoryItem.id,
          (reductions.get(inventoryItem.id) || 0) + Math.max(Number(sessionItem.servings) || 1, 1)
        );
      });
    });

    setInventory((current) =>
      current.map((item) => {
        const reductionAmount = reductions.get(item.id) || 0;
        if (!reductionAmount || Number(item.quantity || 0) <= 0) return item;

        return {
          ...item,
          quantity: Math.max(Number(item.quantity || 0) - reductionAmount, 0)
        };
      })
    );

    setChopboardItems([]);
    setActiveTab("dashboard");
    alert("Chopboard session closed. Inventory was reduced for the matched in-stock ingredients.");
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", eyebrow: "Home Base", description: "Start here for pantry signals, open grocery items, and the quickest next steps." },
    { id: "menu", label: "Menu", eyebrow: "Choose Faster", description: "Scroll meal ideas quickly when you just want to decide what to eat." },
    { id: "chopboard", label: "Chopboard", eyebrow: "Open Session", description: "Collect menu items, confirm the session, and close it to estimate pantry depletion." },
    { id: "recipes", label: "Recipes", eyebrow: "Cookbook", description: "Keep full recipes, notes, tags, and images in one place." },
    { id: "inventory", label: "Kitchen Inventory", eyebrow: "Track Pantry", description: "Update what you have at home so grocery needs stay accurate." },
    { id: "grocery", label: "Grocery List", eyebrow: "Shop Better", description: "See what needs to be bought and mark things restock after shopping." },
    { id: "food-log", label: "Food Log", eyebrow: "Track Meals", description: "Log what you ate and see your daily nutrition totals." }
  ];

  const activeTabMeta = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const recipeOptions = useMemo(
    () => recipes.map((recipe) => recipe.recipeName).sort((a, b) => a.localeCompare(b)),
    [recipes]
  );
  const selectedFoodLogRecipe = useMemo(
    () => recipes.find((recipe) => recipe.recipeName === foodLogForm.recipeName) || null,
    [recipes, foodLogForm.recipeName]
  );
  const selectedFoodLogEstimate = useMemo(
    () => selectedFoodLogRecipe ? getRecipeNutritionEstimate(selectedFoodLogRecipe, inventoryWithStatus) : null,
    [selectedFoodLogRecipe, inventoryWithStatus]
  );
  const todaysFoodLogEntries = useMemo(
    () => foodLog.filter((entry) => isSameLocalDay(entry.consumedAt)),
    [foodLog]
  );
  const todaysNutritionTotals = useMemo(
    () => todaysFoodLogEntries.reduce((totals, entry) => ({
      calories: totals.calories + Number(entry.calories || 0),
      proteinG: totals.proteinG + Number(entry.proteinG || 0),
      carbsG: totals.carbsG + Number(entry.carbsG || 0),
      fatG: totals.fatG + Number(entry.fatG || 0)
    }), { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }),
    [todaysFoodLogEntries]
  );
  const displayName = currentUser?.email ? currentUser.email.split("@")[0] : "Account";

  if (session && currentUser && (isHydratingData || !hasRemoteDataLoaded)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#fcfcfa] to-kitchen-cream">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full overflow-hidden rounded-[2rem] border border-kitchen-sage bg-white shadow-soft">
            <div className="border-b border-kitchen-sage/70 bg-kitchen-sand/50 px-5 py-4 sm:px-6">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-kitchen-leaf">
                Personal Food Manager
              </p>
            </div>
            <div className="space-y-4 px-5 py-8 text-center sm:px-6">
              <h1 className="text-3xl font-semibold sm:text-4xl">Kitchen Companion</h1>
              <p className="text-sm text-slate-600 sm:text-base">
                Loading your shared household recipes, inventory, and grocery list from Supabase.
              </p>
              {remoteLoadError ? (
                <div className="rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {remoteLoadError}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session || !currentUser) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(220,232,215,0.95),_rgba(255,255,255,1)_36%,_rgba(247,236,227,0.85)_100%)]">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="overflow-hidden rounded-[2.25rem] border border-kitchen-sage/80 bg-[linear-gradient(145deg,_rgba(75,101,74,0.96),_rgba(112,143,103,0.92))] p-6 text-white shadow-soft sm:p-8">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/75">Personal Food Manager</p>
              <h1 className="mt-6 max-w-lg text-4xl font-semibold leading-tight sm:text-5xl">Kitchen Companion</h1>
              <p className="mt-4 max-w-xl text-sm text-white/80 sm:text-base">
                Keep your menu ideas, recipes, pantry, and grocery list connected in one shared food home.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/70">Menu</p>
                  <p className="mt-2 text-sm text-white/90">Decide what to eat quickly.</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/70">Pantry</p>
                  <p className="mt-2 text-sm text-white/90">Track what is low or finished.</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/70">Grocery</p>
                  <p className="mt-2 text-sm text-white/90">Stay ready for the next shop.</p>
                </div>
              </div>
            </section>
            <div className="overflow-hidden rounded-[2.25rem] border border-kitchen-sage bg-white shadow-soft">
              <div className="border-b border-kitchen-sage/70 bg-kitchen-sand/50 px-5 py-4 sm:px-6">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-kitchen-leaf">
                  Sign In
                </p>
              </div>
              <div className="space-y-6 px-5 py-6 sm:px-6 sm:py-8">
                <div>
                  <h2 className="text-3xl font-semibold sm:text-4xl">Welcome back</h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                    Sign in to access your shared recipes, pantry tracking, and grocery planning.
                  </p>
                </div>
                <form onSubmit={handleSignIn} className="grid gap-4 md:grid-cols-2">
                <InputField
                  label="Email"
                  type="email"
                  value={authForm.email}
                  onChange={(value) => setAuthForm({ ...authForm, email: value })}
                  placeholder="Enter your email"
                  required
                />
                <InputField
                  label="Password"
                  type="password"
                  value={authForm.password}
                  onChange={(value) => setAuthForm({ ...authForm, password: value })}
                  placeholder="Enter your password"
                  required
                />
                <div className="md:col-span-2 flex justify-end">
                  <PrimaryButton>Sign In</PrimaryButton>
                </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(220,232,215,0.95),_rgba(255,255,255,1)_34%,_rgba(247,236,227,0.85)_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 overflow-hidden rounded-[2.25rem] border border-kitchen-sage/80 bg-white/95 shadow-soft backdrop-blur-sm">
          <div className="grid gap-5 border-b border-kitchen-sage/70 bg-[linear-gradient(135deg,_rgba(248,245,238,0.96),_rgba(233,242,230,0.9))] px-5 py-5 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-kitchen-leaf">
                Personal Food Manager
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.02em] text-kitchen-moss sm:text-5xl">Kitchen Companion</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-700 sm:text-base">
                Your shared food home for deciding what to eat, tracking the pantry, and staying ahead of grocery needs.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full border border-white/70 bg-white/75 px-4 py-2 font-medium text-kitchen-moss shadow-sm">{inventoryWithStatus.length} pantry item{inventoryWithStatus.length !== 1 ? "s" : ""}</span>
                <span className="rounded-full border border-white/70 bg-white/75 px-4 py-2 font-medium text-kitchen-moss shadow-sm">{recipes.length} recipe{recipes.length !== 1 ? "s" : ""}</span>
                <span className="rounded-full border border-white/70 bg-white/75 px-4 py-2 font-medium text-kitchen-moss shadow-sm">{grocery.filter((item) => !item.bought && !item.suppressed).length} grocery item{grocery.filter((item) => !item.bought && !item.suppressed).length !== 1 ? "s" : ""}</span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] lg:grid-cols-1">
              <div className="rounded-[1.6rem] border border-kitchen-sage/70 bg-white/80 px-4 py-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-kitchen-leaf">Current Focus</p>
                <p className="mt-3 text-2xl font-semibold text-kitchen-moss">{activeTabMeta.label}</p>
                <p className="mt-2 text-sm text-slate-600">{activeTabMeta.description}</p>
              </div>
              <div className="rounded-[1.6rem] border border-kitchen-sage/70 bg-kitchen-cream px-4 py-4 shadow-sm sm:min-w-[240px]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-kitchen-leaf">Signed In</p>
                <p className="mt-2 text-xl font-semibold text-kitchen-moss">{displayName}</p>
                <div className="mt-4">
                  <SecondaryButton type="button" onClick={signOutUser}>
                    Sign Out
                  </SecondaryButton>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4 px-5 py-5 sm:px-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-[1.2rem] border px-5 py-3 text-sm font-semibold tracking-[0.02em] transition ${
                    activeTab === tab.id
                      ? "border-kitchen-leaf bg-kitchen-leaf text-white shadow-sm"
                      : "border-[#d8e4d2] bg-[#eef6e8] text-kitchen-moss hover:border-kitchen-leaf hover:bg-[#e4f1db]"
                  }`}
                >
                  <span className="block text-left">{tab.label}</span>
                  <span className={`mt-1 block text-[11px] font-medium uppercase tracking-[0.18em] ${activeTab === tab.id ? "text-white/75" : "text-kitchen-leaf"}`}>{tab.eyebrow}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        {activeTab === "dashboard" && (
          <section className="space-y-6">
            <section className="grid gap-4 md:grid-cols-3">
              <QuickJumpCard
                eyebrow="Start Here"
                title="Browse the menu"
                description="Scroll meal ideas first when you are deciding what to cook today."
                actionLabel="Open Menu"
                onClick={() => setActiveTab("menu")}
                accent="sage"
              />
              <QuickJumpCard
                eyebrow="Keep Updated"
                title="Update kitchen inventory"
                description="Adjust pantry quantities after cooking so grocery alerts stay accurate."
                actionLabel="Open Inventory"
                onClick={() => setActiveTab("inventory")}
                accent="cream"
              />
              <QuickJumpCard
                eyebrow="Ready to Shop"
                title="Review grocery list"
                description="See what is still open and mark items restock after shopping."
                actionLabel="Open Grocery"
                onClick={() => setActiveTab("grocery")}
                accent="blush"
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
              <Panel
                title="Today’s Health Snapshot"
                action={
                  <SecondaryButton type="button" onClick={() => setActiveTab("food-log")}>
                    Open Food Log
                  </SecondaryButton>
                }
              >
                <div className="mb-4 overflow-hidden rounded-[1.5rem] border border-kitchen-sage/60 bg-[radial-gradient(circle_at_top_left,_rgba(223,238,229,0.98),_rgba(255,255,255,0.94)_52%,_rgba(224,239,247,0.72))] px-4 py-4 sm:px-5">
                  <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-kitchen-leaf">Daily Nutrition</p>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-700">A quick health check from today’s logged meals and your current goals.</p>
                    </div>
                    <div className="rounded-2xl bg-white/85 px-4 py-3 text-left shadow-sm md:min-w-[9rem] md:text-right">
                      <p className="text-2xl font-semibold text-kitchen-moss">{todaysFoodLogEntries.length}</p>
                      <p className="text-xs uppercase tracking-[0.16em] text-kitchen-leaf">meal{todaysFoodLogEntries.length !== 1 ? "s" : ""} today</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <NutritionTotalCard label="Calories" value={Math.round(todaysNutritionTotals.calories)} goal={dailyNutritionGoals.calories} unit="cal" tone="inStock" />
                  <NutritionTotalCard label="Protein" value={roundInventoryValue(todaysNutritionTotals.proteinG)} goal={dailyNutritionGoals.proteinG} unit="g" tone="lowStock" />
                  <NutritionTotalCard label="Carbs" value={roundInventoryValue(todaysNutritionTotals.carbsG)} goal={dailyNutritionGoals.carbsG} unit="g" tone="finished" />
                  <NutritionTotalCard label="Fat" value={roundInventoryValue(todaysNutritionTotals.fatG)} goal={dailyNutritionGoals.fatG} unit="g" tone="medium" />
                </div>
              </Panel>

              <Panel title="Recent Meals Today">
                {todaysFoodLogEntries.length === 0 ? (
                  <EmptyState text="No meals logged yet today." />
                ) : (
                  <SimpleList
                    items={todaysFoodLogEntries.slice(0, 3)}
                    emptyText="No meals logged yet today."
                    renderItem={(entry) => (
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-kitchen-moss">{entry.recipeName}</p>
                          <p className="text-sm text-slate-600">{entry.servingsEaten} serving{entry.servingsEaten !== 1 ? "s" : ""} • {new Date(entry.consumedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
                        </div>
                        <span className="text-sm font-medium text-slate-700">{entry.calories} cal</span>
                      </div>
                    )}
                  />
                )}
              </Panel>
            </section>

            <section className="overflow-hidden rounded-[2rem] border border-kitchen-sage bg-[radial-gradient(circle_at_top_left,_rgba(219,229,218,0.9),_rgba(247,247,243,1)_48%,_rgba(244,224,217,0.55))] px-6 py-6 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-kitchen-leaf">Kitchen Pulse</p>
                  <h2 className="mt-3 text-3xl font-semibold text-kitchen-moss sm:text-4xl">{shoppingSignal.label}</h2>
                </div>
                <SecondaryButton type="button" onClick={() => setIsShoppingSignalOpen((current) => !current)}>
                  {isShoppingSignalOpen ? "Collapse" : "Expand"}
                </SecondaryButton>
              </div>
              {isShoppingSignalOpen ? (
                <div className="mt-5 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                  <div>
                    <p className="max-w-2xl text-sm text-slate-700 sm:text-base">{shoppingSignal.message}</p>
                    <div className="mt-5 flex flex-wrap gap-3 text-sm">
                      <span className="rounded-full bg-white/80 px-4 py-2 font-medium text-kitchen-moss shadow-sm">{alertItems.length} pantry alert{alertItems.length !== 1 ? "s" : ""}</span>
                      <span className="rounded-full bg-white/80 px-4 py-2 font-medium text-kitchen-moss shadow-sm">{alertItems.filter((item) => normalizePriority(item.priority) === "Critical").length} critical item{alertItems.filter((item) => normalizePriority(item.priority) === "Critical").length !== 1 ? "s" : ""}</span>
                      <span className="rounded-full bg-white/80 px-4 py-2 font-medium text-kitchen-moss shadow-sm">{grocery.filter((item) => !item.bought && !item.suppressed).length} grocery item{grocery.filter((item) => !item.bought && !item.suppressed).length !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                  <ShoppingSignalCard signal={shoppingSignal} alertCount={alertItems.length} criticalCount={alertItems.filter((item) => normalizePriority(item.priority) === "Critical").length} />
                </div>
              ) : (
                <div className="mt-5 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full bg-white/80 px-4 py-2 font-medium text-kitchen-moss shadow-sm">{alertItems.length} pantry alert{alertItems.length !== 1 ? "s" : ""}</span>
                  <span className="rounded-full bg-white/80 px-4 py-2 font-medium text-kitchen-moss shadow-sm">{alertItems.filter((item) => normalizePriority(item.priority) === "Critical").length} critical item{alertItems.filter((item) => normalizePriority(item.priority) === "Critical").length !== 1 ? "s" : ""}</span>
                  <span className="rounded-full bg-white/80 px-4 py-2 font-medium text-kitchen-moss shadow-sm">{grocery.filter((item) => !item.bought && !item.suppressed).length} grocery item{grocery.filter((item) => !item.bought && !item.suppressed).length !== 1 ? "s" : ""}</span>
                </div>
              )}
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <Panel
                title="Low or Running Out"
                action={
                  <SecondaryButton type="button" onClick={() => setIsLowAlertsOpen((current) => !current)}>
                    {isLowAlertsOpen ? "Collapse" : "Expand"}
                  </SecondaryButton>
                }
              >
                {isLowAlertsOpen ? (
                  <SimpleList
                    items={alertItems}
                    emptyText="No pantry items need attention right now."
                    renderItem={(item) => (
                      <UrgencyRow
                        item={item}
                        detail={`${item.category} • ${item.quantity} ${item.unit} • Threshold ${item.threshold}`}
                      />
                    )}
                  />
                ) : (
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="rounded-full bg-kitchen-cream px-4 py-2 font-medium text-kitchen-moss shadow-sm">{alertItems.length} total alert{alertItems.length !== 1 ? "s" : ""}</span>
                    <span className="rounded-full bg-kitchen-cream px-4 py-2 font-medium text-kitchen-moss shadow-sm">{alertItems.filter((item) => normalizePriority(item.priority) === "Critical").length} critical</span>
                    <span className="rounded-full bg-kitchen-cream px-4 py-2 font-medium text-kitchen-moss shadow-sm">{alertItems.filter((item) => normalizePriority(item.priority) === "Essential").length} essential</span>
                    <span className="rounded-full bg-kitchen-cream px-4 py-2 font-medium text-kitchen-moss shadow-sm">{alertItems.filter((item) => normalizePriority(item.priority) === "Supplementary").length} supplementary</span>
                  </div>
                )}
              </Panel>
              <div className="space-y-6">
                <Panel title="Inventory Snapshot">
                  <div className="mb-4 overflow-hidden rounded-[1.5rem] border border-kitchen-sage/60 bg-[radial-gradient(circle_at_top_left,_rgba(219,229,218,0.95),_rgba(255,255,255,0.92)_52%,_rgba(244,224,217,0.6))] px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-kitchen-leaf">Pantry Mood</p>
                        <p className="mt-2 text-sm text-slate-700">A quick visual check of what is stocked, low, or finished.</p>
                      </div>
                      <div className="flex items-end gap-2 text-3xl">
                        <span className="rounded-2xl bg-white/80 px-3 py-2 shadow-sm">🥬</span>
                        <span className="rounded-2xl bg-white/80 px-3 py-2 shadow-sm">🥚</span>
                        <span className="rounded-2xl bg-white/80 px-3 py-2 shadow-sm">🥫</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <MiniStat label="In Stock" value={inStockItems.length} total={inventoryWithStatus.length} tone="inStock" />
                    <MiniStat label="Low Stock" value={lowStockItems.length} total={inventoryWithStatus.length} tone="lowStock" />
                    <MiniStat label="Finished" value={finishedItems.length} total={inventoryWithStatus.length} tone="finished" />
                  </div>
                </Panel>
                <Panel title="Open Grocery Items">
                  <SimpleList
                    items={grocery.filter((item) => !item.bought && !item.suppressed).sort((a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority))}
                    emptyText="Your grocery list is clear."
                    renderItem={(item) => (
                      <DashboardGroceryRow
                        item={item}
                        onQuantityChange={updateGroceryQuantity}
                        onRestock={markRestocked}
                      />
                    )}
                  />
                </Panel>
              </div>
            </div>
          </section>
        )}

        {activeTab === "menu" && (
          <section className="space-y-6">
            <Panel
              title="Menu Ideas"
              action={
                <span className="rounded-full bg-kitchen-cream px-4 py-2 text-sm font-medium text-kitchen-moss">
                  {filteredMenuRecipes.length} item{filteredMenuRecipes.length !== 1 ? "s" : ""}
                </span>
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <SearchFilterField
                  label="Search Menu"
                  value={menuSearchFilter}
                  onChange={setMenuSearchFilter}
                  suggestions={menuSearchSuggestions}
                  selectedValues={menuSearchTerms}
                  onAdd={(term) => setMenuSearchTerms((current) => addUniqueFilterTerm(current, term))}
                  onRemove={(term) => setMenuSearchTerms((current) => removeFilterTerm(current, term))}
                  placeholder="Soup, noodles, chicken..."
                />
                <SelectField label="Category" value={menuCategoryFilter} onChange={setMenuCategoryFilter} options={recipeCategories} />
              </div>
              <div className="mt-4">
                <ExcludeFilterField
                  label="Exclude From Menu"
                  value={menuExcludeInput}
                  onChange={setMenuExcludeInput}
                  suggestions={menuExcludeSuggestions}
                  selectedValues={menuExcludedTerms}
                  onAdd={(term) => setMenuExcludedTerms((current) => addUniqueFilterTerm(current, term))}
                  onRemove={(term) => setMenuExcludedTerms((current) => removeFilterTerm(current, term))}
                  placeholder="Exclude an ingredient, tag, or dish name"
                />
              </div>
              <p className="mt-3 text-sm text-slate-600">Use this page when you just want to decide what to eat. Open a recipe when you want the full ingredients and steps.</p>
            </Panel>

            <div className="space-y-3">
              {filteredMenuRecipes.length === 0 ? (
                <EmptyState text="No menu items match right now." />
              ) : (
                filteredMenuRecipes.map((recipe) => {
                  const chopboardSelection = chopboardSelectionMap.get(recipe.id);

                  return (
                    <article key={recipe.id} className="overflow-hidden rounded-[1.5rem] border border-kitchen-sage bg-white shadow-soft">
                      <div className="grid gap-3 p-3 sm:grid-cols-[92px_1fr_auto] sm:items-start">
                        <div
                          className="h-20 rounded-[1rem] bg-kitchen-sand"
                          style={recipe.imageUrl ? {
                            backgroundImage: `linear-gradient(180deg, rgba(27, 38, 31, 0.08), rgba(27, 38, 31, 0.24)), url(${recipe.imageUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                          } : {
                            backgroundImage: "linear-gradient(135deg, rgba(234,241,232,0.98), rgba(255,255,255,0.98) 45%, rgba(245,232,226,0.92))"
                          }}
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-kitchen-moss">{recipe.recipeName}</h3>
                            <span className="rounded-full bg-kitchen-cream px-2.5 py-1 text-[11px] font-medium text-kitchen-leaf">{recipe.category || "Recipe"}</span>
                            {chopboardSelection ? (
                              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-medium text-emerald-800">
                                On Chopboard
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm text-slate-600">{recipe.difficulty} • {recipe.prepTime}</p>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-700">{recipe.notes || "Open the recipe to see the full details for this dish."}</p>

                          {chopboardSelection ? (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Serving Size</span>
                              {SERVING_SIZE_OPTIONS.map((size) => (
                                <button
                                  key={size}
                                  type="button"
                                  onClick={() => updateChopboardServings(recipe.id, size)}
                                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${chopboardSelection.servings === size ? "bg-kitchen-leaf text-white" : "bg-kitchen-cream text-kitchen-moss hover:bg-kitchen-sage"}`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
                          <PrimaryButton type="button" onClick={() => openRecipeFromMenu(recipe)} className="whitespace-nowrap px-4 py-2 text-sm">
                            Open Recipe
                          </PrimaryButton>
                          <SecondaryButton type="button" onClick={() => addRecipeToChopboard(recipe)} className="whitespace-nowrap px-4 py-2 text-sm">
                            {chopboardSelection ? "Added to Chopboard" : "Add to Chopboard"}
                          </SecondaryButton>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        )}


        {activeTab === "chopboard" && (
          <section className="space-y-6">
            <Panel
              title="The Chopboard"
              action={
                <span className="rounded-full bg-kitchen-cream px-4 py-2 text-sm font-medium text-kitchen-moss">
                  {chopboardSessionItems.length} item{chopboardSessionItems.length !== 1 ? "s" : ""}
                </span>
              }
            >
              <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[1.75rem] border border-kitchen-sage/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(244,249,242,0.94))] px-5 py-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-kitchen-leaf">Open Session</p>
                  <h3 className="mt-2 text-2xl font-semibold text-kitchen-moss">Build your cooking lineup before reducing inventory.</h3>
                  <p className="mt-3 text-sm text-slate-600">
                    Add dishes from the Menu, choose serving sizes, then confirm every tile here. Inventory is only reduced after you close the Chopboard session.
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-kitchen-sage/70 bg-white px-5 py-5 shadow-sm">
                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                    <MiniStat label="Selected" value={chopboardSessionItems.length} total={Math.max(chopboardSessionItems.length, 1)} tone="inStock" />
                    <MiniStat label="Confirmed" value={chopboardSessionItems.filter((item) => item.confirmed).length} total={Math.max(chopboardSessionItems.length, 1)} tone="lowStock" />
                    <MiniStat label="Inventory Matches" value={chopboardReducibleCount} total={Math.max(chopboardReducibleCount, 1)} tone="finished" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <PrimaryButton type="button" onClick={closeChopboardSession} className="px-5 py-2.5" disabled={!chopboardSessionItems.length || !allChopboardConfirmed}>
                      Close Session and Reduce Inventory
                    </PrimaryButton>
                    <SecondaryButton type="button" onClick={() => setActiveTab("menu")}>
                      Go Back to Menu
                    </SecondaryButton>
                  </div>
                  {!allChopboardConfirmed && chopboardSessionItems.length ? (
                    <p className="mt-3 text-sm text-slate-600">Confirm every item below before closing the session.</p>
                  ) : null}
                </div>
              </div>
            </Panel>

            {chopboardSessionItems.length === 0 ? (
              <EmptyState text="Your Chopboard is empty. Add dishes from the Menu to start a cooking session." />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {chopboardSessionItems.map((sessionItem) => {
                  const { recipe } = sessionItem;
                  return (
                    <article key={sessionItem.recipeId} className="overflow-hidden rounded-[1.75rem] border border-kitchen-sage bg-white shadow-soft">
                      <div
                        className="h-40 bg-kitchen-sand"
                        style={recipe.imageUrl ? {
                          backgroundImage: `linear-gradient(180deg, rgba(27, 38, 31, 0.18), rgba(27, 38, 31, 0.58)), url(${recipe.imageUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center"
                        } : {
                          backgroundImage: "linear-gradient(135deg, rgba(234,241,232,0.98), rgba(255,255,255,0.98) 45%, rgba(245,232,226,0.92))"
                        }}
                      />
                      <div className="space-y-4 px-5 py-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-lg font-semibold text-kitchen-moss">{recipe.recipeName}</p>
                            <p className="mt-1 text-sm text-slate-600">{recipe.category} • {sessionItem.servings} serving{sessionItem.servings !== 1 ? "s" : ""}</p>
                          </div>
                          <PriorityBadge priority={sessionItem.reducibleInventoryItems.length ? "Essential" : "Low Priority"} />
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Serving Size</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {SERVING_SIZE_OPTIONS.map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => updateChopboardServings(sessionItem.recipeId, size)}
                                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${sessionItem.servings === size ? "bg-kitchen-leaf text-white" : "bg-kitchen-cream text-kitchen-moss hover:bg-kitchen-sage"}`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-[1.25rem] bg-kitchen-cream px-4 py-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Inventory Matches</p>
                          <p className="mt-2 text-sm text-slate-700">
                            {sessionItem.reducibleInventoryItems.length
                              ? sessionItem.reducibleInventoryItems.map((item) => item.itemName).join(", ")
                              : "No in-stock ingredient matches found yet. This session can still close, but nothing will be reduced for this dish."}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <label className="inline-flex items-center gap-2 text-sm font-medium text-kitchen-moss">
                            <input
                              type="checkbox"
                              checked={sessionItem.confirmed}
                              onChange={() => toggleChopboardConfirm(sessionItem.recipeId)}
                              className="h-4 w-4 rounded border-kitchen-sage text-kitchen-leaf focus:ring-kitchen-leaf"
                            />
                            Confirm this item for session close
                          </label>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <PrimaryButton type="button" onClick={() => openRecipeFromMenu(recipe)} className="px-4 py-2 text-sm">
                            Open Recipe
                          </PrimaryButton>
                          <SecondaryButton type="button" onClick={() => setActiveTab("menu")} className="px-4 py-2 text-sm">
                            Add More Items
                          </SecondaryButton>
                          <DangerButton type="button" onClick={() => removeFromChopboard(sessionItem.recipeId)} className="px-4 py-2 text-sm">
                            Remove
                          </DangerButton>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === "recipes" && (
          <section className="space-y-6">
            <div ref={recipeFormSectionRef}>
              <Panel
              title={editingRecipeId ? "Edit Recipe" : "Add New Recipe"}
              action={
                <div className="flex flex-wrap gap-2">
                  <input ref={recipeImportInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={importRecipeCSV} />
                  <SecondaryButton type="button" onClick={() => recipeImportInputRef.current?.click()}>
                    Import CSV
                  </SecondaryButton>
                  <SecondaryButton type="button" onClick={() => setIsRecipeFormOpen((current) => !current)}>
                    {isRecipeFormOpen ? "Hide Form" : editingRecipeId ? "Open Form" : "Add Recipe"}
                  </SecondaryButton>
                </div>
              }
            >
              <div className="mb-4 rounded-[1.25rem] border border-kitchen-sage/60 bg-kitchen-cream/70 px-4 py-3 text-sm text-slate-700">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRecipeImportHelpOpen((current) => !current)}
                    className="text-sm font-medium text-kitchen-moss underline underline-offset-4 transition hover:text-kitchen-leaf"
                  >
                    {isRecipeImportHelpOpen ? "Hide import format" : "Import format help"}
                  </button>
                  {recipeImportFeedback ? <p className="text-xs font-medium text-kitchen-leaf">{recipeImportFeedback}</p> : null}
                </div>
                {isRecipeImportHelpOpen ? (
                  <div className="mt-3 space-y-1 text-xs leading-5 text-slate-600">
                    <p>Recipe CSV import merges by recipe name.</p>
                    <p>Suggested columns: recipe_name, category, difficulty, prep_time, servings, ingredients, steps, notes, image_url, tags, structured_ingredients.</p>
                    <p>For structured ingredients use a cell like <span className="font-mono">Paneer|200|g;Ginger|2|piece</span>.</p>
                  </div>
                ) : null}
              </div>
              {isRecipeFormOpen ? (
                <form onSubmit={saveRecipe} className="grid gap-4 md:grid-cols-2">
                  <InputField label="Recipe Name" value={recipeForm.recipeName} onChange={(value) => setRecipeForm({ ...recipeForm, recipeName: value })} required />
                  <SelectField label="Category" value={recipeForm.category} onChange={(value) => setRecipeForm({ ...recipeForm, category: value })} options={RECIPE_CATEGORIES} placeholder="Select a category" required />
                  <InputField label="Difficulty" value={recipeForm.difficulty} onChange={(value) => setRecipeForm({ ...recipeForm, difficulty: value })} required />
                  <InputField label="Prep Time" value={recipeForm.prepTime} onChange={(value) => setRecipeForm({ ...recipeForm, prepTime: value })} required />
                  <InputField label="Servings" type="number" value={recipeForm.servings} onChange={(value) => setRecipeForm({ ...recipeForm, servings: value })} placeholder="4" required />
                  <div className="md:col-span-2 rounded-[1.5rem] border border-kitchen-sage/60 bg-kitchen-cream/70 p-4">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-kitchen-moss">Structured Ingredients</p>
                        <p className="text-xs text-slate-500">Add ingredient rows with quantity and unit to improve nutrition accuracy. The text box below can stay as notes or fallback text.</p>
                      </div>
                      <SecondaryButton type="button" onClick={() => setRecipeForm((current) => ({ ...current, structuredIngredients: [...(Array.isArray(current.structuredIngredients) ? current.structuredIngredients : []), emptyStructuredIngredient()] }))}>
                        Add Ingredient Row
                      </SecondaryButton>
                    </div>
                    <div className="space-y-4">
                      {(Array.isArray(recipeForm.structuredIngredients) ? recipeForm.structuredIngredients : []).length ? (Array.isArray(recipeForm.structuredIngredients) ? recipeForm.structuredIngredients : []).map((ingredient, index) => (
                        <div key={`${ingredient.name}-${index}`} className="grid gap-3 rounded-[1.25rem] border border-kitchen-sage/50 bg-white p-3 md:grid-cols-[1.6fr_0.7fr_0.7fr_auto] md:items-end">
                          <SuggestInputField
                            label={`Ingredient ${index + 1}`}
                            value={ingredient.name}
                            onChange={(value) => setRecipeForm((current) => ({
                              ...current,
                              structuredIngredients: (Array.isArray(current.structuredIngredients) ? current.structuredIngredients : []).map((row, rowIndex) => rowIndex === index ? { ...row, name: value } : row)
                            }))}
                            onSelectSuggestion={(value) => setRecipeForm((current) => ({
                              ...current,
                              structuredIngredients: (Array.isArray(current.structuredIngredients) ? current.structuredIngredients : []).map((row, rowIndex) => rowIndex === index ? { ...row, name: value } : row)
                            }))}
                            suggestions={getRecipeIngredientNameSuggestions(ingredient.name, inventoryWithStatus)}
                            placeholder="Paneer"
                          />
                          <InputField label="Qty" type="number" value={ingredient.quantity} onChange={(value) => setRecipeForm((current) => ({
                            ...current,
                            structuredIngredients: (Array.isArray(current.structuredIngredients) ? current.structuredIngredients : []).map((row, rowIndex) => rowIndex === index ? { ...row, quantity: value } : row)
                          }))} placeholder="200" />
                          <InputField label="Unit" value={ingredient.unit} onChange={(value) => setRecipeForm((current) => ({
                            ...current,
                            structuredIngredients: (Array.isArray(current.structuredIngredients) ? current.structuredIngredients : []).map((row, rowIndex) => rowIndex === index ? { ...row, unit: value } : row)
                          }))} placeholder="g, cup, piece" />
                          <DangerButton type="button" className="md:self-end" onClick={() => setRecipeForm((current) => {
                            const nextIngredients = (Array.isArray(current.structuredIngredients) ? current.structuredIngredients : []).filter((_, rowIndex) => rowIndex !== index);
                            return {
                              ...current,
                              structuredIngredients: nextIngredients.length ? nextIngredients : [emptyStructuredIngredient()]
                            };
                          })}>
                            Remove
                          </DangerButton>
                        </div>
                      )) : (
                        <p className="text-sm text-slate-500">No structured ingredients yet.</p>
                      )}
                    </div>
                  </div>
                  <TextAreaField label="Ingredients (fallback text or notes)" value={recipeForm.ingredients} onChange={(value) => setRecipeForm({ ...recipeForm, ingredients: value })} />
                  <TextAreaField label="Steps" value={recipeForm.steps} onChange={(value) => setRecipeForm({ ...recipeForm, steps: value })} required />
                  <TextAreaField label="Notes" value={recipeForm.notes} onChange={(value) => setRecipeForm({ ...recipeForm, notes: value })} />
                  <InputField label="Image URL" value={recipeForm.imageUrl} onChange={(value) => setRecipeForm({ ...recipeForm, imageUrl: value })} placeholder="Paste a matching recipe image link" />
                  <InputField label="Tags" value={recipeForm.tags} onChange={(value) => setRecipeForm({ ...recipeForm, tags: value })} placeholder="Healthy, Husband Friendly" />
                  <div className="md:col-span-2 flex flex-wrap gap-3">
                    <PrimaryButton>{editingRecipeId ? "Update Recipe" : "Save Recipe"}</PrimaryButton>
                    {editingRecipeId && (
                      <SecondaryButton type="button" onClick={resetRecipeForm}>
                        Cancel
                      </SecondaryButton>
                    )}
                  </div>
                </form>
              ) : (
                <p className="text-sm text-slate-600">Open this section when you want to add or edit a recipe.</p>
              )}
            </Panel>
            </div>

            <Panel title="Filter Recipes">
              <div className="grid gap-4 md:grid-cols-3">
                <SearchFilterField
                  label="Search Recipes"
                  value={recipeSearchFilter}
                  onChange={setRecipeSearchFilter}
                  suggestions={recipeSearchSuggestions}
                  selectedValues={recipeSearchTerms}
                  onAdd={(term) => setRecipeSearchTerms((current) => addUniqueFilterTerm(current, term))}
                  onRemove={(term) => setRecipeSearchTerms((current) => removeFilterTerm(current, term))}
                  placeholder="Chicken, soup, oats..."
                />
                <SelectField label="Category" value={recipeCategoryFilter} onChange={setRecipeCategoryFilter} options={recipeCategories} />
                <SelectField label="Tag" value={recipeTagFilter} onChange={setRecipeTagFilter} options={recipeTags} />
              </div>
              <div className="mt-4">
                <ExcludeFilterField
                  label="Exclude From Recipes"
                  value={recipeExcludeInput}
                  onChange={setRecipeExcludeInput}
                  suggestions={recipeExcludeSuggestions}
                  selectedValues={recipeExcludedTerms}
                  onAdd={(term) => setRecipeExcludedTerms((current) => addUniqueFilterTerm(current, term))}
                  onRemove={(term) => setRecipeExcludedTerms((current) => removeFilterTerm(current, term))}
                  placeholder="Exclude an ingredient, tag, or recipe name"
                />
              </div>
            </Panel>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-kitchen-sage bg-white px-5 py-4 shadow-soft">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-kitchen-leaf">Recipe View</p>
                <p className="mt-1 text-sm text-slate-600">Switch between a cleaner text layout and a photo-based layout.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <SecondaryButton type="button" onClick={() => setRecipeViewMode("text")} className={recipeViewMode === "text" ? "ring-2 ring-kitchen-sage" : ""}>
                  Text Mode
                </SecondaryButton>
                <SecondaryButton type="button" onClick={() => setRecipeViewMode("picture")} className={recipeViewMode === "picture" ? "ring-2 ring-kitchen-sage" : ""}>
                  Picture Mode
                </SecondaryButton>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {displayedRecipes.length === 0 ? (
                <EmptyState text="No recipes saved yet." />
              ) : (
                displayedRecipes.map((recipe) => {
                  const nutritionEstimate = getRecipeNutritionEstimate(recipe, inventoryWithStatus);

                  return (
                  <article
                    key={recipe.id}
                    className={`overflow-hidden rounded-[1.75rem] border border-kitchen-sage shadow-soft ${
                      recipeViewMode === "picture"
                        ? "relative min-h-[24rem] bg-kitchen-moss"
                        : "bg-white p-5"
                    }`}
                    style={recipeViewMode === "picture" && recipe.imageUrl
                      ? {
                          backgroundImage: `linear-gradient(180deg, rgba(27, 38, 31, 0.24), rgba(27, 38, 31, 0.9)), url(${recipe.imageUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center"
                        }
                      : recipeViewMode === "picture"
                        ? {
                            backgroundImage: "linear-gradient(135deg, rgba(234,241,232,0.98), rgba(255,255,255,0.98) 45%, rgba(245,232,226,0.92))"
                          }
                        : undefined}
                  >
                    <div className={recipeViewMode === "picture" ? (recipe.imageUrl ? "flex min-h-[24rem] flex-col justify-between bg-gradient-to-t from-black/55 via-black/20 to-black/5 p-5 text-white" : "flex min-h-[24rem] flex-col justify-between p-5 text-slate-900") : ""}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold">{recipe.recipeName}</h3>
                          <p className={`mt-1 text-sm ${recipeViewMode === "picture" ? (recipe.imageUrl ? "text-white/85" : "text-slate-600") : "text-slate-600"}`}>
                            {recipe.category} • {recipe.difficulty} • {recipe.prepTime} • {recipe.servings} serving{recipe.servings !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <SecondaryButton type="button" onClick={() => startRecipeEdit(recipe)} className={recipeViewMode === "picture" && recipe.imageUrl ? "bg-white/85" : ""}>
                            Edit
                          </SecondaryButton>
                          <DangerButton type="button" onClick={() => deleteRecipe(recipe.id)} className={recipeViewMode === "picture" && recipe.imageUrl ? "bg-white/85" : ""}>
                            Delete
                          </DangerButton>
                        </div>
                      </div>
                      <div className={`mt-4 space-y-3 text-sm ${recipeViewMode === "picture" ? (recipe.imageUrl ? "rounded-[1.25rem] bg-black/35 p-4 text-white/95 backdrop-blur-[2px]" : "rounded-[1.25rem] bg-white/80 p-4 text-slate-700" ) : "text-slate-700"}`}>
                        {recipe.structuredIngredients?.length ? (
                          <div>
                            <p><span className={`font-medium ${recipeViewMode === "picture" ? (recipe.imageUrl ? "text-white" : "text-kitchen-moss") : "text-kitchen-moss"}`}>Ingredients:</span></p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {recipe.structuredIngredients.map((ingredient, index) => (
                                <span key={`${ingredient.name}-${index}`} className={`rounded-full px-3 py-1 text-xs font-medium ${recipeViewMode === "picture" ? (recipe.imageUrl ? "bg-white/15 text-white" : "bg-kitchen-sage text-kitchen-moss") : "bg-kitchen-sage text-kitchen-moss"}`}>
                                  {formatStructuredIngredient(ingredient)}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p><span className={`font-medium ${recipeViewMode === "picture" ? (recipe.imageUrl ? "text-white" : "text-kitchen-moss") : "text-kitchen-moss"}`}>Ingredients:</span> {recipe.ingredients}</p>
                        )}
                        <p><span className={`font-medium ${recipeViewMode === "picture" ? (recipe.imageUrl ? "text-white" : "text-kitchen-moss") : "text-kitchen-moss"}`}>Steps:</span> {recipe.steps}</p>
                        <p><span className={`font-medium ${recipeViewMode === "picture" ? (recipe.imageUrl ? "text-white" : "text-kitchen-moss") : "text-kitchen-moss"}`}>Notes:</span> {recipe.notes || "None"}</p>
                        <div className={`rounded-[1rem] border px-3 py-3 ${recipeViewMode === "picture" ? (recipe.imageUrl ? "border-white/15 bg-white/10 text-white/90" : "border-kitchen-sage/50 bg-kitchen-cream/70 text-slate-700") : "border-kitchen-sage/50 bg-kitchen-cream/70 text-slate-700"}`}>
                          <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${recipeViewMode === "picture" ? (recipe.imageUrl ? "text-white/80" : "text-kitchen-leaf") : "text-kitchen-leaf"}`}>Nutrition Preview</p>
                          {nutritionEstimate.hasEstimate ? (
                            <>
                              <p className="mt-2 font-medium">
                                Recipe total: {nutritionEstimate.calories} cal • {formatNutritionNumber(nutritionEstimate.proteinG)}g protein • {formatNutritionNumber(nutritionEstimate.carbsG)}g carbs • {formatNutritionNumber(nutritionEstimate.fatG)}g fat
                              </p>
                              <p className="mt-1 font-medium">
                                Per serving ({nutritionEstimate.servings} total): {nutritionEstimate.caloriesPerServing} cal • {formatNutritionNumber(nutritionEstimate.proteinPerServing)}g protein • {formatNutritionNumber(nutritionEstimate.carbsPerServing)}g carbs • {formatNutritionNumber(nutritionEstimate.fatPerServing)}g fat
                              </p>
                              <p className={`mt-1 text-xs ${recipeViewMode === "picture" ? (recipe.imageUrl ? "text-white/75" : "text-slate-500") : "text-slate-500"}`}>
                                {nutritionEstimate.usesStructuredEstimate ? "Estimate uses your structured ingredient quantities when the units line up, and falls back to one nutrition serving when they do not." : "Starter estimate based on 1 nutrition serving of each matched ingredient in your inventory."} {nutritionEstimate.nutritionItems.length} of {nutritionEstimate.matchedItems.length} matched ingredients currently have nutrition data.
                              </p>
                            </>
                          ) : (
                            <p className={`mt-2 text-xs ${recipeViewMode === "picture" ? (recipe.imageUrl ? "text-white/75" : "text-slate-500") : "text-slate-500"}`}>
                              No nutrition estimate yet. Add ingredient nutrition in Kitchen Inventory to start seeing recipe nutrition here.
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recipe.tags.length > 0 ? recipe.tags.map((tag) => (
                            <span key={tag} className={`rounded-full px-3 py-1 text-xs font-medium ${recipeViewMode === "picture" ? (recipe.imageUrl ? "bg-white/20 text-white backdrop-blur-sm" : "bg-kitchen-sage text-kitchen-moss") : "bg-kitchen-sage text-kitchen-moss"}`}>
                              {tag}
                            </span>
                          )) : <span className={`text-xs ${recipeViewMode === "picture" ? (recipe.imageUrl ? "text-white/75" : "text-slate-500") : "text-slate-500"}`}>No tags</span>}
                        </div>
                      </div>
                    </div>
                  </article>
                  );
                })
              )}
            </div>

            <Panel title="Recently Deleted Recipes">
              {deletedRecipes.length === 0 ? (
                <EmptyState text="No deleted recipes right now." />
              ) : (
                <div className="space-y-3">
                  {deletedRecipes.map((recipe) => (
                    <div key={recipe.id} className="flex items-center justify-between gap-3 rounded-2xl bg-kitchen-cream px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-kitchen-moss">{recipe.recipeName}</p>
                        <p className="text-sm text-slate-600">{recipe.category} • {recipe.prepTime || "No time set"}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <SecondaryButton type="button" onClick={() => restoreRecipe(recipe.id)}>
                          Restore
                        </SecondaryButton>
                        <DangerButton type="button" onClick={() => permanentlyDeleteRecipe(recipe.id)}>
                          Delete Forever
                        </DangerButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </section>
        )}

        {activeTab === "inventory" && (
          <section className="space-y-6">
            <div ref={inventoryFormSectionRef}>
              <Panel
              title={editingInventoryId ? "Edit Inventory Item" : "Add New Inventory"}
              action={
                <div className="flex flex-wrap gap-2">
                  <input ref={inventoryImportInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={importInventoryCSV} />
                  <SecondaryButton type="button" onClick={() => inventoryImportInputRef.current?.click()}>
                    Import CSV
                  </SecondaryButton>
                  <SecondaryButton type="button" onClick={() => setIsInventoryFormOpen((current) => !current)}>
                    {isInventoryFormOpen ? "Hide Form" : editingInventoryId ? "Open Form" : "Add Inventory"}
                  </SecondaryButton>
                </div>
              }
            >
              <div className="mb-4 rounded-[1.25rem] border border-kitchen-sage/60 bg-kitchen-cream/70 px-4 py-3 text-sm text-slate-700">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsInventoryImportHelpOpen((current) => !current)}
                    className="text-sm font-medium text-kitchen-moss underline underline-offset-4 transition hover:text-kitchen-leaf"
                  >
                    {isInventoryImportHelpOpen ? "Hide import format" : "Import format help"}
                  </button>
                  {inventoryImportFeedback ? <p className="text-xs font-medium text-kitchen-leaf">{inventoryImportFeedback}</p> : null}
                </div>
                {isInventoryImportHelpOpen ? (
                  <div className="mt-3 space-y-1 text-xs leading-5 text-slate-600">
                    <p>Inventory CSV import merges by item name.</p>
                    <p>Suggested columns: item_name, category, quantity, unit, desired_amount, threshold_mode, threshold_percent, low_stock_threshold, priority, tags, notes, nutrition_serving_amount, nutrition_serving_unit, calories, protein_g, carbs_g, fat_g.</p>
                  </div>
                ) : null}
              </div>
              {isInventoryFormOpen ? (
                <form onSubmit={saveInventory} className="grid gap-4 md:grid-cols-2">
                  <InputField label="Item Name" value={inventoryForm.itemName} onChange={(value) => setInventoryForm({ ...inventoryForm, itemName: value })} required />
                  <SelectField label="Category" value={inventoryForm.category} onChange={(value) => setInventoryForm({ ...inventoryForm, category: value })} options={INVENTORY_CATEGORIES} placeholder="Select a category" required />
                  <InputField label="Quantity" type="number" value={inventoryForm.quantity} onChange={(value) => setInventoryForm({ ...inventoryForm, quantity: value })} placeholder="Enter quantity" required />
                  <SelectField label="Unit" value={inventoryForm.unit} onChange={(value) => setInventoryForm({ ...inventoryForm, unit: value })} options={UNIT_OPTIONS} placeholder="Select a unit" />
                  <InputField label="Desired Amount (100%)" type="number" value={inventoryForm.desiredAmount} onChange={(value) => setInventoryForm({ ...inventoryForm, desiredAmount: value })} placeholder="Target pantry level" required />
                  <SelectField label="Threshold Type" value={inventoryForm.thresholdMode} onChange={(value) => setInventoryForm({ ...inventoryForm, thresholdMode: value })} options={["percent", "units"]} />
                  {inventoryForm.thresholdMode === "percent" ? (
                    <>
                      <InputField label="Low Stock Threshold (%)" type="number" value={inventoryForm.thresholdPercent} onChange={(value) => setInventoryForm({ ...inventoryForm, thresholdPercent: value })} placeholder="25" required />
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium">Threshold Preview (Units)</span>
                        <div className="w-full rounded-2xl border border-kitchen-sage bg-kitchen-cream px-4 py-3 text-sm text-slate-600">
                          {roundInventoryValue((Number(inventoryForm.desiredAmount || 0) * Number(inventoryForm.thresholdPercent || 0)) / 100)} {inventoryForm.unit || "item"}
                        </div>
                      </label>
                    </>
                  ) : (
                    <>
                      <InputField label="Low Stock Threshold (Units)" type="number" value={inventoryForm.threshold} onChange={(value) => setInventoryForm({ ...inventoryForm, threshold: value })} placeholder="Enter threshold units" required />
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium">Threshold Preview (%)</span>
                        <div className="w-full rounded-2xl border border-kitchen-sage bg-kitchen-cream px-4 py-3 text-sm text-slate-600">
                          {Number(inventoryForm.desiredAmount || 0) > 0 ? roundInventoryValue((Number(inventoryForm.threshold || 0) / Number(inventoryForm.desiredAmount || 1)) * 100) : 0}%
                        </div>
                      </label>
                    </>
                  )}
                  <SelectField label="Priority" value={inventoryForm.priority} onChange={(value) => setInventoryForm({ ...inventoryForm, priority: value })} options={PRIORITY_OPTIONS} />
                  <InputField label="Tags" value={inventoryForm.tags} onChange={(value) => setInventoryForm({ ...inventoryForm, tags: value })} placeholder="Staple, Breakfast, Protein" />
                  <div className="md:col-span-2 rounded-[1.5rem] border border-kitchen-sage/60 bg-kitchen-cream/70 p-4">
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-kitchen-moss">Nutrition Reference (Per Serving)</p>
                      <p className="text-xs text-slate-500">This is optional for now, but it will power recipe nutrition and daily food tracking next.</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <InputField label="Serving Amount" type="number" value={inventoryForm.nutritionServingAmount} onChange={(value) => setInventoryForm({ ...inventoryForm, nutritionServingAmount: value })} placeholder="1" />
                      <InputField label="Serving Unit" value={inventoryForm.nutritionServingUnit} onChange={(value) => setInventoryForm({ ...inventoryForm, nutritionServingUnit: value })} placeholder="piece, 100 g, cup cooked" />
                      <InputField label="Calories" type="number" value={inventoryForm.calories} onChange={(value) => setInventoryForm({ ...inventoryForm, calories: value })} placeholder="72" />
                      <InputField label="Protein (g)" type="number" value={inventoryForm.proteinG} onChange={(value) => setInventoryForm({ ...inventoryForm, proteinG: value })} placeholder="6.3" />
                      <InputField label="Carbs (g)" type="number" value={inventoryForm.carbsG} onChange={(value) => setInventoryForm({ ...inventoryForm, carbsG: value })} placeholder="0.4" />
                      <InputField label="Fat (g)" type="number" value={inventoryForm.fatG} onChange={(value) => setInventoryForm({ ...inventoryForm, fatG: value })} placeholder="4.8" />
                    </div>
                  </div>
                  <TextAreaField label="Notes" value={inventoryForm.notes} onChange={(value) => setInventoryForm({ ...inventoryForm, notes: value })} />
                  <div className="md:col-span-2 flex flex-wrap gap-3">
                    <PrimaryButton>{editingInventoryId ? "Update Item" : "Save Item"}</PrimaryButton>
                    {editingInventoryId && (
                      <SecondaryButton type="button" onClick={resetInventoryForm}>
                        Cancel
                      </SecondaryButton>
                    )}
                  </div>
                </form>
              ) : (
                <p className="text-sm text-slate-600">Open this section when you want to add or edit kitchen inventory.</p>
              )}
            </Panel>
            </div>

            <Panel title="Find Inventory Items">
              <div className="grid gap-4 md:grid-cols-2">
                <SearchFilterField
                  label="Search Inventory"
                  value={inventorySearchFilter}
                  onChange={setInventorySearchFilter}
                  suggestions={inventorySearchSuggestions}
                  selectedValues={inventorySearchTerms}
                  onAdd={(term) => setInventorySearchTerms((current) => addUniqueFilterTerm(current, term))}
                  onRemove={(term) => setInventorySearchTerms((current) => removeFilterTerm(current, term))}
                  placeholder="Eggs, Produce, Breakfast..."
                />
                <SelectField label="Category" value={inventoryCategoryFilter} onChange={setInventoryCategoryFilter} options={inventoryCategories} />
              </div>
              <div className="mt-4">
                <ExcludeFilterField
                  label="Exclude From Inventory"
                  value={inventoryExcludeInput}
                  onChange={setInventoryExcludeInput}
                  suggestions={inventoryExcludeSuggestions}
                  selectedValues={inventoryExcludedTerms}
                  onAdd={(term) => setInventoryExcludedTerms((current) => addUniqueFilterTerm(current, term))}
                  onRemove={(term) => setInventoryExcludedTerms((current) => removeFilterTerm(current, term))}
                  placeholder="Exclude an item name, category, or tag"
                />
              </div>
            </Panel>

            <div className="grid gap-4 lg:grid-cols-2">
              {filteredInventoryItems.map((item) => (
                <article key={item.id} className="rounded-[1.75rem] border border-kitchen-sage bg-white p-5 shadow-soft">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">{item.itemName}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {item.category} • {item.quantity} {item.unit}
                      </p>
                      {item.tags?.length ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-kitchen-sage px-3 py-1 text-xs font-medium text-kitchen-moss">{tag}</span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <PriorityBadge priority={item.priority} />
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{item.notes || "No notes"}</p>
                  {(item.nutritionServingAmount || item.nutritionServingUnit || item.calories || item.proteinG || item.carbsG || item.fatG) ? (
                    <div className="mt-3 rounded-2xl border border-kitchen-sage/50 bg-kitchen-cream/70 px-4 py-3 text-sm text-slate-700">
                      <p className="font-medium text-kitchen-moss">
                        Per {item.nutritionServingAmount || 1} {item.nutritionServingUnit || "serving"}
                      </p>
                      <p className="mt-1 text-slate-600">
                        {item.calories ?? "-"} cal • {item.proteinG ?? "-"}g protein • {item.carbsG ?? "-"}g carbs • {item.fatG ?? "-"}g fat
                      </p>
                    </div>
                  ) : null}
                  <div className="mt-4">
                    <InventoryLevelGraph item={item} />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <SecondaryButton type="button" onClick={() => startInventoryEdit(item)}>
                      Edit
                    </SecondaryButton>
                    <DangerButton type="button" onClick={() => deleteInventory(item.id)}>
                      Delete
                    </DangerButton>
                  </div>
                </article>
              ))}
            </div>

            <Panel title="Recently Deleted Inventory">
              {deletedInventory.length === 0 ? (
                <EmptyState text="No deleted inventory items right now." />
              ) : (
                <div className="space-y-3">
                  {deletedInventory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-kitchen-cream px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-kitchen-moss">{item.itemName}</p>
                        <p className="text-sm text-slate-600">{item.category} • {item.quantity} {item.unit}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <SecondaryButton type="button" onClick={() => restoreInventory(item.id)}>
                          Restore
                        </SecondaryButton>
                        <DangerButton type="button" onClick={() => permanentlyDeleteInventory(item.id)}>
                          Delete Forever
                        </DangerButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </section>
        )}


        {activeTab === "food-log" && (
          <section className="space-y-6">
            <div ref={foodLogFormSectionRef}>
              <Panel
                title={editingFoodLogId ? "Edit Food Log Entry" : "Log a Meal"}
                action={
                  <SecondaryButton type="button" onClick={() => setIsFoodLogFormOpen((current) => !current)}>
                    {isFoodLogFormOpen ? "Hide Form" : editingFoodLogId ? "Open Form" : "Log Food"}
                  </SecondaryButton>
                }
              >
                {isFoodLogFormOpen ? (
                  <form onSubmit={saveFoodLog} className="grid gap-4 md:grid-cols-2">
                    <SelectField label="Recipe" value={foodLogForm.recipeName} onChange={(value) => setFoodLogForm({ ...foodLogForm, recipeName: value })} options={recipeOptions} placeholder="Select a recipe" required />
                    <InputField label="Servings Eaten" type="number" value={foodLogForm.servingsEaten} onChange={(value) => setFoodLogForm({ ...foodLogForm, servingsEaten: value })} placeholder="1" required />
                    <InputField label="Consumed At" type="datetime-local" value={foodLogForm.consumedAt} onChange={(value) => setFoodLogForm({ ...foodLogForm, consumedAt: value })} required />
                    <TextAreaField label="Notes" value={foodLogForm.notes} onChange={(value) => setFoodLogForm({ ...foodLogForm, notes: value })} />
                    {selectedFoodLogRecipe ? (
                      <div className="md:col-span-2 rounded-[1.5rem] border border-kitchen-sage/60 bg-kitchen-cream/70 p-4 text-sm text-slate-700">
                        <p className="text-sm font-semibold text-kitchen-moss">Estimated Nutrition for This Entry</p>
                        <p className="mt-2">
                          {Math.round((selectedFoodLogEstimate?.caloriesPerServing || 0) * Math.max(Number(foodLogForm.servingsEaten || 1) || 1, 1))} cal • {formatNutritionNumber((selectedFoodLogEstimate?.proteinPerServing || 0) * Math.max(Number(foodLogForm.servingsEaten || 1) || 1, 1))}g protein • {formatNutritionNumber((selectedFoodLogEstimate?.carbsPerServing || 0) * Math.max(Number(foodLogForm.servingsEaten || 1) || 1, 1))}g carbs • {formatNutritionNumber((selectedFoodLogEstimate?.fatPerServing || 0) * Math.max(Number(foodLogForm.servingsEaten || 1) || 1, 1))}g fat
                        </p>
                        <p className="mt-1 text-xs text-slate-500">This uses the current recipe nutrition estimate as a snapshot for the food log entry.</p>
                      </div>
                    ) : null}
                    <div className="md:col-span-2 flex flex-wrap gap-3">
                      <PrimaryButton>{editingFoodLogId ? "Update Entry" : "Save Entry"}</PrimaryButton>
                      {editingFoodLogId ? (
                        <SecondaryButton type="button" onClick={resetFoodLogForm}>Cancel</SecondaryButton>
                      ) : null}
                    </div>
                  </form>
                ) : (
                  <p className="text-sm text-slate-600">Open this section when you want to log what you ate.</p>
                )}
              </Panel>
            </div>

            <Panel
              title="Daily Nutrition Goals"
              action={<SecondaryButton type="button" onClick={() => setDailyNutritionGoals(defaultDailyNutritionGoals())}>Reset Defaults</SecondaryButton>}
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InputField label="Calories Goal" type="number" value={dailyNutritionGoals.calories} onChange={(value) => setDailyNutritionGoals((current) => ({ ...current, calories: Math.max(Number(value || 0) || 0, 0) }))} />
                <InputField label="Protein Goal (g)" type="number" value={dailyNutritionGoals.proteinG} onChange={(value) => setDailyNutritionGoals((current) => ({ ...current, proteinG: Math.max(Number(value || 0) || 0, 0) }))} />
                <InputField label="Carbs Goal (g)" type="number" value={dailyNutritionGoals.carbsG} onChange={(value) => setDailyNutritionGoals((current) => ({ ...current, carbsG: Math.max(Number(value || 0) || 0, 0) }))} />
                <InputField label="Fat Goal (g)" type="number" value={dailyNutritionGoals.fatG} onChange={(value) => setDailyNutritionGoals((current) => ({ ...current, fatG: Math.max(Number(value || 0) || 0, 0) }))} />
              </div>
              <p className="mt-3 text-sm text-slate-600">These goals are now saved with your shared household settings and drive the Food Log and dashboard progress bars.</p>
            </Panel>

            <div className="grid gap-4 lg:grid-cols-4">
              <NutritionTotalCard label="Today Calories" value={Math.round(todaysNutritionTotals.calories)} goal={dailyNutritionGoals.calories} unit="cal" tone="inStock" />
              <NutritionTotalCard label="Protein" value={roundInventoryValue(todaysNutritionTotals.proteinG)} goal={dailyNutritionGoals.proteinG} unit="g" tone="lowStock" />
              <NutritionTotalCard label="Carbs" value={roundInventoryValue(todaysNutritionTotals.carbsG)} goal={dailyNutritionGoals.carbsG} unit="g" tone="finished" />
              <NutritionTotalCard label="Fat" value={roundInventoryValue(todaysNutritionTotals.fatG)} goal={dailyNutritionGoals.fatG} unit="g" tone="medium" />
            </div>

            <Panel title="Today's Entries">
              {todaysFoodLogEntries.length === 0 ? (
                <EmptyState text="No meals logged yet today." />
              ) : (
                <div className="space-y-3">
                  {todaysFoodLogEntries.map((entry) => (
                    <article key={entry.id} className="rounded-[1.5rem] border border-kitchen-sage bg-white px-4 py-4 shadow-soft">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-kitchen-moss">{entry.recipeName}</h3>
                          <p className="mt-1 text-sm text-slate-600">{entry.servingsEaten} serving{entry.servingsEaten !== 1 ? "s" : ""} • {new Date(entry.consumedAt).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <SecondaryButton type="button" onClick={() => startFoodLogEdit(entry)}>Edit</SecondaryButton>
                          <DangerButton type="button" onClick={() => deleteFoodLog(entry.id)}>Delete</DangerButton>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-700">{entry.calories} cal • {formatNutritionNumber(entry.proteinG)}g protein • {formatNutritionNumber(entry.carbsG)}g carbs • {formatNutritionNumber(entry.fatG)}g fat</p>
                      {entry.notes ? <p className="mt-2 text-sm text-slate-600">{entry.notes}</p> : null}
                    </article>
                  ))}
                </div>
              )}
            </Panel>

            <Panel title="Recent Food Log History">
              {foodLog.length === 0 ? (
                <EmptyState text="No food log entries yet." />
              ) : (
                <SimpleList
                  items={foodLog.slice(0, 10)}
                  emptyText="No food log entries yet."
                  renderItem={(entry) => (
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-kitchen-moss">{entry.recipeName}</p>
                        <p className="text-sm text-slate-600">{entry.servingsEaten} serving{entry.servingsEaten !== 1 ? "s" : ""} • {new Date(entry.consumedAt).toLocaleString()}</p>
                      </div>
                      <span className="text-sm font-medium text-slate-700">{entry.calories} cal</span>
                    </div>
                  )}
                />
              )}
            </Panel>
          </section>
        )}

        {activeTab === "grocery" && (
          <section className="space-y-6">
            <div ref={groceryFormSectionRef}>
              <Panel
              title={editingGroceryId ? "Edit Grocery Item" : "Add New Grocery Item"}
              action={
                <div className="flex flex-wrap gap-2">
                  <SecondaryButton type="button" onClick={() => setIsGroceryFormOpen((current) => !current)}>
                    {isGroceryFormOpen ? "Hide Form" : editingGroceryId ? "Open Form" : "Add Grocery"}
                  </SecondaryButton>
                  <PrimaryButton type="button" onClick={addLowStockItemsToGrocery}>
                    Sync Pantry Alerts
                  </PrimaryButton>
                </div>
              }
            >
              {isGroceryFormOpen ? (
                <form onSubmit={saveGrocery} className="grid gap-4 md:grid-cols-2">
                  <SuggestInputField
                    label="Item Name"
                    value={groceryForm.itemName}
                    onChange={(value) => setGroceryForm({ ...groceryForm, itemName: value })}
                    onSelectSuggestion={applyInventoryItemToGroceryForm}
                    suggestions={groceryItemSuggestions}
                    placeholder="Search kitchen inventory items"
                    required
                  />
                  <InputField label="Quantity" type="number" value={groceryForm.quantity} onChange={(value) => setGroceryForm({ ...groceryForm, quantity: value })} placeholder="Enter quantity" required />
                  <SelectField label="Unit" value={groceryForm.unit} onChange={(value) => setGroceryForm({ ...groceryForm, unit: value })} options={UNIT_OPTIONS} placeholder="Select a unit" />
                  <SelectField label="Category" value={groceryForm.category} onChange={(value) => setGroceryForm({ ...groceryForm, category: value })} options={GROCERY_CATEGORIES} placeholder="Select a category" required />
                  <SelectField label="Priority" value={groceryForm.priority} onChange={(value) => setGroceryForm({ ...groceryForm, priority: value })} options={PRIORITY_OPTIONS} />
                  <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-kitchen-sage bg-kitchen-cream px-4 py-3 text-sm">
                    <input
                      type="checkbox"
                      checked={groceryForm.bought}
                      onChange={(event) => setGroceryForm({ ...groceryForm, bought: event.target.checked })}
                      className="h-4 w-4"
                    />
                    Bought already
                  </label>
                  <div className="md:col-span-2 flex flex-wrap gap-3">
                    <PrimaryButton>{editingGroceryId ? "Update Grocery Item" : "Save Grocery Item"}</PrimaryButton>
                    {editingGroceryId && (
                      <SecondaryButton type="button" onClick={resetGroceryForm}>
                        Cancel
                      </SecondaryButton>
                    )}
                  </div>
                </form>
              ) : (
                <p className="text-sm text-slate-600">Open this section when you want to add or edit a grocery item.</p>
              )}
            </Panel>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {grocery.filter((item) => !item.suppressed).map((item) => (
                <article key={item.id} className="rounded-[1.75rem] border border-kitchen-sage bg-white p-5 shadow-soft">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">{item.itemName}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {item.quantity} {item.unit} • {item.category}
                      </p>
                      <div className="mt-2">
                        <PriorityBadge priority={item.priority} />
                      </div>
                      {item.source === "low-stock" && (
                        <p className="mt-2 text-xs font-medium uppercase tracking-[0.15em] text-kitchen-leaf">
                          Added from pantry alert
                        </p>
                      )}
                    </div>
                    <label className="flex items-center text-sm text-slate-600" aria-label={`Toggle ${item.itemName} bought`}>
                      <input
                        type="checkbox"
                        checked={item.bought}
                        onChange={() => toggleGroceryBought(item.id)}
                        className="h-4 w-4"
                      />
                    </label>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <SecondaryButton type="button" onClick={() => startGroceryEdit(item)}>
                      Edit
                    </SecondaryButton>
                    <SecondaryButton type="button" onClick={() => markRestocked(item)}>
                      Restock to Inventory
                    </SecondaryButton>
                    <button
                      type="button"
                      onClick={() => deleteGrocery(item.id)}
                      className="rounded-full bg-kitchen-blush px-4 py-2 text-sm font-medium text-kitchen-moss transition hover:opacity-90"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function DashboardCard({ title, count, note }) {
  return (
    <article className="rounded-[1.75rem] border border-kitchen-sage bg-white p-5 shadow-soft">
      <p className="text-sm text-slate-600">{title}</p>
      <p className="mt-3 text-3xl font-semibold">{count}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-kitchen-leaf">{note}</p>
    </article>
  );
}

function NutritionTotalCard({ label, value, goal = 0, unit = "", tone = "inStock" }) {
  const toneClasses = {
    inStock: "bg-gradient-to-r from-emerald-500 to-emerald-300",
    lowStock: "bg-gradient-to-r from-amber-500 to-yellow-300",
    finished: "bg-gradient-to-r from-red-500 to-rose-300",
    medium: "bg-gradient-to-r from-sky-500 to-cyan-300"
  };
  const numericValue = Number(value || 0);
  const numericGoal = Math.max(Number(goal || 0), 0);
  const rawPercent = numericGoal > 0 ? Math.round((numericValue / numericGoal) * 100) : 0;
  const barPercent = numericGoal > 0 ? Math.min(rawPercent, 100) : 0;

  return (
    <div className="rounded-[1.5rem] border border-kitchen-sage/80 bg-white px-4 py-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-kitchen-leaf">{label}</p>
          <p className="mt-3 text-3xl font-semibold leading-none text-kitchen-moss sm:text-[2rem]">{value}<span className="ml-1 text-base font-medium text-slate-500">{unit}</span></p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p>{numericGoal > 0 ? `${rawPercent}% of goal` : "No goal set"}</p>
          <p className="mt-1">{numericGoal > 0 ? `${numericGoal}${unit ? ` ${unit}` : ""} goal` : "Set a target below"}</p>
        </div>
      </div>
      <div className="mt-4 h-3 rounded-full bg-kitchen-cream">
        <div className={`h-3 rounded-full ${toneClasses[tone] || toneClasses.inStock}`} style={{ width: `${barPercent}%` }} />
      </div>
    </div>
  );
}

function MiniStat({ label, value, total = 0, tone = "inStock" }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  const barStyles = {
    inStock: "bg-[linear-gradient(90deg,_rgba(126,164,120,0.92),_rgba(165,198,157,0.95))]",
    lowStock: "bg-[linear-gradient(90deg,_rgba(245,158,11,0.92),_rgba(252,211,77,0.95))]",
    finished: "bg-[linear-gradient(90deg,_rgba(239,68,68,0.9),_rgba(248,113,113,0.95))]"
  };

  return (
    <div className="rounded-[1.4rem] border border-kitchen-sage/60 bg-[linear-gradient(135deg,_rgba(255,255,255,0.95),_rgba(236,231,223,0.8))] px-4 py-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-kitchen-moss">{value} • {percent}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/85 ring-1 ring-kitchen-sage/30">
        <div
          className={`h-full rounded-full transition-all ${barStyles[tone] || barStyles.inStock}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function InventoryLevelGraph({ item }) {
  const toneStyles = {
    healthy: "bg-[linear-gradient(90deg,_rgba(99,151,102,0.95),_rgba(163,201,142,0.95))]",
    caution: "bg-[linear-gradient(90deg,_rgba(245,158,11,0.95),_rgba(251,191,36,0.95))]",
    "below-threshold": "bg-[linear-gradient(90deg,_rgba(249,115,22,0.96),_rgba(251,146,60,0.95))]",
    critical: "bg-[linear-gradient(90deg,_rgba(220,38,38,0.98),_rgba(248,113,113,0.95))]",
    empty: "bg-[linear-gradient(90deg,_rgba(127,29,29,0.98),_rgba(239,68,68,0.95))]",
    over: "bg-[linear-gradient(90deg,_rgba(14,116,144,0.96),_rgba(56,189,248,0.95))]"
  };

  const statusCopy = {
    healthy: "Healthy level",
    caution: "Below ideal level",
    "below-threshold": "Below low-stock threshold",
    critical: "Near depletion",
    empty: "Finished",
    over: "Over target"
  };

  const maxGraphPercent = 110;
  const hundredMarkerPercent = (100 / maxGraphPercent) * 100;
  const barWidthPercent = Math.max((item.inventoryDisplayPercent / maxGraphPercent) * 100, item.quantity > 0 ? 4 : 0);
  const thresholdMarkerLeft = Math.min((item.thresholdMarkerPercent / maxGraphPercent) * 100, hundredMarkerPercent);

  return (
    <div className="rounded-[1.35rem] border border-kitchen-sage/60 bg-[linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(244,249,242,0.9))] px-4 py-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-kitchen-leaf">Stock Level</p>
          <p className="mt-1 text-sm text-slate-600">{statusCopy[item.inventoryLevelTone] || "Healthy level"}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-kitchen-moss">{item.inventoryLevelPercent}%</p>
          <p className="text-xs text-slate-500">Target {item.desiredQuantity} {item.unit}</p>
        </div>
      </div>

      <div className="relative pt-5">
        <div className="absolute left-0 right-0 top-0 flex justify-between text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
          <span>0%</span>
          <span>100%</span>
          <span>110%</span>
        </div>
        <div className="relative h-4 overflow-visible rounded-full bg-slate-200/90 ring-1 ring-kitchen-sage/25">
          <div className="absolute inset-y-0 w-px bg-white/90" style={{ left: `${hundredMarkerPercent}%` }} />
          <div className="absolute inset-y-[-4px] w-px bg-kitchen-moss/35" style={{ left: `${hundredMarkerPercent}%` }} />
          {item.threshold > 0 ? (
            <div
              className="absolute inset-y-[-5px] w-[2px] rounded-full bg-red-500/80"
              style={{ left: `${thresholdMarkerLeft}%` }}
            />
          ) : null}
          <div
            className={`h-full rounded-full transition-all ${toneStyles[item.inventoryLevelTone] || toneStyles.healthy}`}
            style={{ width: `${barWidthPercent}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <span>Current: {item.quantity} {item.unit}</span>
          <span>Threshold: {item.effectiveThreshold} {item.unit} • {item.effectiveThresholdPercent}%</span>
          <span>Desired: {item.desiredQuantity} {item.unit}</span>
        </div>
      </div>
    </div>
  );
}

function QuickJumpCard({ eyebrow, title, description, actionLabel, onClick, accent = "sage" }) {
  const accents = {
    sage: "bg-[linear-gradient(145deg,_rgba(231,242,226,0.95),_rgba(255,255,255,0.92))]",
    cream: "bg-[linear-gradient(145deg,_rgba(250,244,230,0.98),_rgba(255,255,255,0.92))]",
    blush: "bg-[linear-gradient(145deg,_rgba(248,234,229,0.96),_rgba(255,255,255,0.92))]"
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[1.75rem] border border-kitchen-sage/70 p-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-kitchen-leaf hover:shadow-md ${accents[accent] || accents.sage}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-kitchen-leaf">{eyebrow}</p>
      <h3 className="mt-3 text-2xl font-semibold text-kitchen-moss">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-5 inline-flex rounded-full border border-kitchen-sage/70 bg-white/80 px-4 py-2 text-sm font-medium text-kitchen-moss">
        {actionLabel}
      </span>
    </button>
  );
}

function Panel({ title, action, children }) {
  return (
    <section className="rounded-[1.75rem] border border-kitchen-sage/80 bg-white/95 p-4 shadow-soft backdrop-blur-sm sm:p-5 lg:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-kitchen-moss sm:text-[1.35rem]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "Finished": "bg-kitchen-blush text-kitchen-moss",
    "Low Stock": "bg-amber-100 text-amber-800",
    "In Stock": "bg-kitchen-sage text-kitchen-moss"
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function ListRow({ title, detail, action }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-kitchen-cream px-4 py-3">
      <div>
        <p className="text-sm font-medium text-kitchen-moss">{title}</p>
        <p className="text-sm text-slate-600">{detail}</p>
      </div>
      {action}
    </div>
  );
}

function DashboardGroceryRow({ item, onQuantityChange, onRestock }) {
  const numericQuantity = Number(item.quantity) || 0;

  return (
    <div className="rounded-[1.4rem] border border-white/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(247,247,243,0.92))] px-4 py-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-kitchen-moss">{item.itemName}</p>
            <PriorityBadge priority={item.priority} />
          </div>
          <p className="mt-1 text-sm text-slate-600">{item.category} • {item.unit}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end lg:w-auto">
          <div className="inline-flex items-center justify-between overflow-hidden rounded-full border border-kitchen-sage bg-white shadow-sm">
            <button
              type="button"
              onClick={() => onQuantityChange(item.id, Math.max(numericQuantity - 1, 0))}
              className="px-3 py-2 text-sm font-semibold text-kitchen-moss transition hover:bg-kitchen-sage/70"
              aria-label={`Decrease ${item.itemName} quantity`}
            >
              -
            </button>
            <input
              type="number"
              min="0"
              step="0.1"
              value={item.quantity}
              onChange={(event) => onQuantityChange(item.id, event.target.value)}
              className="w-16 border-x border-kitchen-sage bg-transparent px-2 py-2 text-center text-sm font-medium outline-none"
              aria-label={`${item.itemName} quantity`}
            />
            <button
              type="button"
              onClick={() => onQuantityChange(item.id, numericQuantity + 1)}
              className="px-3 py-2 text-sm font-semibold text-kitchen-moss transition hover:bg-kitchen-sage/70"
              aria-label={`Increase ${item.itemName} quantity`}
            >
              +
            </button>
          </div>
          <SecondaryButton type="button" onClick={() => onRestock(item)} className="w-full justify-center sm:w-auto">
            Restock to Inventory
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const normalizedPriority = normalizePriority(priority);
  const styles = {
    "Critical": "bg-red-100 text-red-800",
    "Essential": "bg-amber-100 text-amber-800",
    "Supplementary": "bg-sky-100 text-sky-800",
    "Low Priority": "bg-slate-100 text-slate-700"
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${styles[normalizedPriority] || styles["Supplementary"]}`}>
      {normalizedPriority}
    </span>
  );
}

function UrgencyBar({ percent, tone }) {
  const toneStyles = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-amber-400",
    low: "bg-kitchen-leaf"
  };

  return (
    <div className="w-full rounded-full bg-slate-200">
      <div
        className={`h-2 rounded-full transition-all ${toneStyles[tone] || toneStyles.low}`}
        style={{ width: `${Math.max(percent, 6)}%` }}
      />
    </div>
  );
}

function UrgencyRow({ item, detail }) {
  return (
    <div className="rounded-[1.4rem] border border-white/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(247,247,243,0.92))] px-4 py-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-kitchen-moss">{item.itemName}</p>
            <PriorityBadge priority={item.priority} />
            <StatusBadge status={item.status} />
          </div>
          <p className="mt-1 text-sm text-slate-600">{detail}</p>
        </div>
        <div className="w-full max-w-xs sm:w-56">
          <div className="mb-1 flex items-center justify-between text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <span>{item.itemName}</span>
            <span>{item.stockPercent}%</span>
          </div>
          <UrgencyBar percent={item.stockPercent} tone={item.urgencyTone} />
        </div>
      </div>
    </div>
  );
}

function ShoppingSignalCard({ signal, alertCount, criticalCount }) {
  const styles = {
    critical: "border-red-200 bg-[linear-gradient(135deg,_rgba(254,226,226,0.95),_rgba(255,255,255,0.9))] text-red-900",
    high: "border-orange-200 bg-[linear-gradient(135deg,_rgba(255,237,213,0.95),_rgba(255,255,255,0.9))] text-orange-900",
    medium: "border-amber-200 bg-[linear-gradient(135deg,_rgba(254,249,195,0.95),_rgba(255,255,255,0.9))] text-amber-900",
    low: "border-kitchen-sage bg-[linear-gradient(135deg,_rgba(219,229,218,0.75),_rgba(255,255,255,0.92))] text-kitchen-moss"
  };

  return (
    <div className={`rounded-[1.75rem] border px-5 py-5 shadow-sm ${styles[signal.tone] || styles.low}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em]">{signal.label}</p>
          <p className="mt-2 text-sm">{signal.message}</p>
        </div>
        <div className="text-sm font-medium">
          <p>{alertCount} pantry alert{alertCount !== 1 ? "s" : ""}</p>
          <p>{criticalCount} critical item{criticalCount !== 1 ? "s" : ""}</p>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, type = "text", placeholder = "", required = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-kitchen-sage bg-kitchen-cream px-4 py-3 text-sm outline-none transition focus:border-kitchen-leaf"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, required = false }) {
  return (
    <label className="block md:col-span-2">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <textarea
        rows="4"
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-kitchen-sage bg-kitchen-cream px-4 py-3 text-sm outline-none transition focus:border-kitchen-leaf"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options, placeholder = "", required = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <select
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-kitchen-sage bg-kitchen-cream px-4 py-3 text-sm outline-none transition focus:border-kitchen-leaf"
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function SuggestInputField({ label, value, onChange, onSelectSuggestion, suggestions, placeholder = "", required = false }) {
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-2 block text-sm font-medium">{label}</span>
        <input
          type="text"
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && suggestions[0]) {
              event.preventDefault();
              onSelectSuggestion(suggestions[0]);
            }
          }}
          className="w-full rounded-2xl border border-kitchen-sage bg-kitchen-cream px-4 py-3 text-sm outline-none transition focus:border-kitchen-leaf"
        />
      </label>
      {value && suggestions.length ? (
        <div className="flex flex-wrap gap-2 rounded-[1.25rem] border border-kitchen-sage/60 bg-white px-3 py-3">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSelectSuggestion(suggestion)}
              className="rounded-full bg-kitchen-cream px-3 py-1.5 text-xs font-medium text-kitchen-moss transition hover:bg-kitchen-sage"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SearchFilterField({ label, value, onChange, suggestions, selectedValues, onAdd, onRemove, placeholder }) {
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-2 block text-sm font-medium">{label}</span>
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (suggestions[0]) {
                onAdd(suggestions[0]);
                onChange("");
              }
            }
          }}
          className="w-full rounded-2xl border border-kitchen-sage bg-kitchen-cream px-4 py-3 text-sm outline-none transition focus:border-kitchen-leaf"
        />
      </label>
      {selectedValues.length ? (
        <div className="flex flex-wrap gap-2">
          {selectedValues.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => onRemove(term)}
              className="rounded-full border border-kitchen-sage bg-white px-3 py-1.5 text-xs font-medium text-kitchen-moss transition hover:bg-kitchen-sage"
            >
              {term} ×
            </button>
          ))}
        </div>
      ) : null}
      {value && suggestions.length ? (
        <div className="flex flex-wrap gap-2 rounded-[1.25rem] border border-kitchen-sage/60 bg-white px-3 py-3">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                onAdd(suggestion);
                onChange("");
              }}
              className="rounded-full bg-kitchen-cream px-3 py-1.5 text-xs font-medium text-kitchen-moss transition hover:bg-kitchen-sage"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ExcludeFilterField({ label, value, onChange, suggestions, selectedValues, onAdd, onRemove, placeholder }) {
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-2 block text-sm font-medium">{label}</span>
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (suggestions[0]) {
                onAdd(suggestions[0]);
                onChange("");
              }
            }
          }}
          className="w-full rounded-2xl border border-kitchen-sage bg-kitchen-cream px-4 py-3 text-sm outline-none transition focus:border-kitchen-leaf"
        />
      </label>
      {selectedValues.length ? (
        <div className="flex flex-wrap gap-2">
          {selectedValues.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => onRemove(term)}
              className="rounded-full border border-kitchen-sage bg-white px-3 py-1.5 text-xs font-medium text-kitchen-moss transition hover:bg-kitchen-sage"
            >
              {term} ×
            </button>
          ))}
        </div>
      ) : null}
      {value && suggestions.length ? (
        <div className="flex flex-wrap gap-2 rounded-[1.25rem] border border-kitchen-sage/60 bg-white px-3 py-3">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                onAdd(suggestion);
                onChange("");
              }}
              className="rounded-full bg-kitchen-cream px-3 py-1.5 text-xs font-medium text-kitchen-moss transition hover:bg-kitchen-sage"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SimpleList({ items, emptyText, renderItem }) {
  if (!items.length) {
    return <EmptyState text={emptyText} />;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-kitchen-sage bg-white p-6 text-sm text-slate-500">
      {text}
    </div>
  );
}

function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`rounded-full bg-kitchen-leaf px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 ${className}`}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`rounded-full bg-kitchen-sand px-4 py-2 text-sm font-medium text-kitchen-moss transition hover:bg-kitchen-sage ${className}`}
    >
      {children}
    </button>
  );
}

function DangerButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`rounded-full bg-kitchen-blush px-4 py-2 text-sm font-medium text-kitchen-moss transition hover:opacity-90 ${className}`}
    >
      {children}
    </button>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
