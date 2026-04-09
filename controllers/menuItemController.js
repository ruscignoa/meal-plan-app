const store = require('../data/store');

exports.getAllMenuItems = (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    const items = store.getAllMenuItems(filter);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu items.' });
  }
};

exports.createMenuItem = (req, res) => {
  try {
    const item = store.createMenuItem(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateMenuItem = (req, res) => {
  try {
    const item = store.updateMenuItem(req.params.id, req.body);
    if (!item) return res.status(404).json({ error: 'Menu item not found.' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMenuItem = (req, res) => {
  try {
    const item = store.deleteMenuItem(req.params.id);
    if (!item) return res.status(404).json({ error: 'Menu item not found.' });
    res.json({ message: 'Menu item deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete menu item.' });
  }
};

exports.seedMenuItems = (req, res) => {
  try {
    const existing = store.countMenuItems();
    if (existing > 0) {
      return res.status(400).json({ error: 'Menu already has items. Delete the data/menu.json file to re-seed.' });
    }

    const sampleItems = [
      // === SANDWICHES ($12 each) ===
      { name: 'The Italian Combo', description: 'Ham, mortadella, provolone, roasted peppers, vinaigrette.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'The Big Tony', description: 'Honey turkey, smoked mozzarella, sun dried tomato, vinaigrette.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'The Yankee Clipper', description: 'Turkey, mozzarella, roasted peppers, vinaigrette.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: "Dom's Special", description: 'Lettuce, tomato, roasted peppers, mozzarella, sun dried tomato, vinaigrette.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'Uncle Frank', description: 'Prosciutto, mozzarella, roasted peppers, vinaigrette.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: "Nick's Burner", description: 'Hot soppressata, hot capicola, ham, hot peppers, vinaigrette.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'The Super Hero', description: 'Ham, soppressata, mozzarella, roasted peppers, vinaigrette.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'The H Dub', description: 'Roast beef, swiss, lettuce, tomato, mayo.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'The Down Town', description: 'Hot pastrami, swiss, mustard, onions.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'The Alfonso', description: 'Pepper turkey, provolone, lettuce, tomato, mayo.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'The Hitman', description: 'Ham, mozzarella, roasted peppers.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'Goodfella', description: 'Mortadella, smoked mozzarella, sun dried tomatoes, vinaigrette.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'NYPD', description: 'Roast beef, cheddar, lettuce, tomato, peppadew, mayo.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'The Belmont', description: 'Chicken cutlet, creamy gorgonzola, arugula, vinaigrette.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'The 187th Street', description: 'Ham, salami, mozzarella, lettuce, tomato, vinaigrette.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'FDNY', description: 'Grilled chicken, broccoli rabe, fresh mozzarella, vinaigrette.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'Spice of Life', description: 'Roast beef, pepper jack cheese, hot peppers, horseradish sauce.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'The Captain', description: 'Ham cappy, hot soppressata, muenster cheese, spicy white wine mustard.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'The Last Meal', description: 'Prosciutto, mortadella, capicola, soppressata, fresh mozzarella, roasted peppers, vinaigrette.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'Buffalo Bill', description: 'Buffalo chicken, alpine lace cheese, lettuce, tomato, vinaigrette.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'Bella Donna', description: 'Chicken cutlet, prosciutto, Prima Donna cheese, arugula, sundried peppers, vinaigrette.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'The DaVinci', description: 'Fried eggplant, tangy imported swiss, pesto sauce, roasted peppers, tomato, vinaigrette.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'The Parma', description: 'Parma prosciutto, Parma salami, parmigiano cheese, artichokes, balsamic glaze.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'Artisan Truffle', description: 'Parma prosciutto, truffled pecorino, marinated eggplant, tomato, arugula, balsamic glaze.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'Chicken Alla Jack', description: 'Grilled chicken, pepper jack cheese, hot peppers, vinaigrette.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'Chicken Supreme', description: 'Breaded chicken, fresh mozzarella, vinaigrette.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'Chicken on Fire', description: 'Breaded chicken, hot capicola, cherry peppers, vinaigrette.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'Chicken Alla Prosciutto', description: 'Breaded chicken, mozzarella, prosciutto, vinaigrette.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'Chicken to Go', description: 'Breaded chicken, ham, swiss, lettuce, tomato, mayo.', category: 'sandwiches', price: 12.00, pricingType: 'per-item' },

      // === SPECIALTY SANDWICHES ($12 each) ===
      { name: 'DSNY "The Strongest"', description: 'Breaded chicken, fried eggplant, prosciutto, fresh mozzarella, roasted peppers, vinaigrette.', category: 'specialty-sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'Con Ed "The Brightest"', description: 'Imported prosciutto, fried eggplant, fresh mozzarella, arugula, sun-dried peppers, vinaigrette.', category: 'specialty-sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'DOE "The Smartest"', description: 'Breaded chicken, honey ham, imported swiss, lettuce, tomato, onions, honey mustard.', category: 'specialty-sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'The DOB "The Safest"', description: 'Ham cappy, salami, pepperjack cheese, lettuce, tomato, mayo, vinaigrette.', category: 'specialty-sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'New York Botanical', description: 'Fresh mozzarella, arugula, sun-dried peppers, marinated eggplant, pesto, vinaigrette.', category: 'specialty-sandwiches', price: 12.00, pricingType: 'per-item' },
      { name: 'The Bronx Zoo', description: 'Prosciutto, mortadella, capicola, fried eggplant, fresh mozzarella, vinaigrette.', category: 'specialty-sandwiches', price: 12.00, pricingType: 'per-item' },

      // === PASTA ===
      { name: 'Baked Ziti', description: 'Classic baked ziti with ricotta and mozzarella.', category: 'pasta', price: 15.00, pricingType: 'per-person' },
      { name: 'Fusilli with Sausage', description: 'Fusilli pasta tossed with Italian sausage in marinara.', category: 'pasta', price: 15.00, pricingType: 'per-person' },
      { name: 'Manicotti', description: 'Ricotta-stuffed manicotti in marinara sauce.', category: 'pasta', price: 15.00, pricingType: 'per-person' },
      { name: 'Lasagna', description: 'Layers of pasta, ricotta, mozzarella, and meat sauce.', category: 'pasta', price: 15.00, pricingType: 'per-person' },
      { name: 'Penne alla Vodka', description: 'Penne in a creamy vodka tomato sauce.', category: 'pasta', price: 15.00, pricingType: 'per-person' },
      { name: 'Pasta with Broccoli', description: 'Pasta tossed with sauteed broccoli in garlic oil.', category: 'pasta', price: 15.00, pricingType: 'per-person' },
      { name: 'Macaroni and Cheese', description: 'Creamy baked mac and cheese.', category: 'pasta', price: 15.00, pricingType: 'per-person' },
      { name: 'Ravioli', description: 'Cheese ravioli in marinara sauce.', category: 'pasta', price: 15.00, pricingType: 'per-person' },
      { name: 'Stuffed Shells', description: 'Ricotta-stuffed shells baked in marinara.', category: 'pasta', price: 15.00, pricingType: 'per-person' },
      { name: 'Rigatoni Chicken Diavolo', description: 'Rigatoni with chicken in a spicy diavolo sauce.', category: 'pasta', price: 15.00, pricingType: 'per-person' },
      { name: 'Fusilli Primavera', description: 'Fusilli with fresh seasonal vegetables.', category: 'pasta', price: 15.00, pricingType: 'per-person' },
      { name: 'Spaghetti Bolognese', description: 'Spaghetti with traditional bolognese meat sauce.', category: 'pasta', price: 15.00, pricingType: 'per-person' },

      // === CHICKEN ===
      { name: 'Chicken Cacciatore', description: 'Braised chicken with tomatoes, peppers, and onions.', category: 'chicken', price: 15.00, pricingType: 'per-person' },
      { name: 'Chicken Parmigiana', description: 'Breaded chicken topped with marinara and mozzarella.', category: 'chicken', price: 15.00, pricingType: 'per-person' },
      { name: 'Chicken Francese', description: 'Egg-battered chicken in a lemon butter sauce.', category: 'chicken', price: 15.00, pricingType: 'per-person' },
      { name: 'Chicken Teriyaki', description: 'Grilled chicken glazed with teriyaki sauce.', category: 'chicken', price: 15.00, pricingType: 'per-person' },
      { name: 'Chicken Rollatini', description: 'Chicken rolled with prosciutto and mozzarella.', category: 'chicken', price: 15.00, pricingType: 'per-person' },
      { name: 'Chicken Scarpariello', description: 'Chicken with sausage, peppers, and potatoes.', category: 'chicken', price: 15.00, pricingType: 'per-person' },
      { name: 'Chicken Marsala', description: 'Chicken in a rich marsala wine mushroom sauce.', category: 'chicken', price: 15.00, pricingType: 'per-person' },
      { name: 'Fried Chicken', description: 'Classic Italian-style fried chicken.', category: 'chicken', price: 15.00, pricingType: 'per-person' },
      { name: 'Chicken with Broccoli', description: 'Sauteed chicken breast with broccoli in garlic sauce.', category: 'chicken', price: 15.00, pricingType: 'per-person' },
      { name: 'Chicken with Sundried Tomato', description: 'Chicken breast with sundried tomatoes in a light cream sauce.', category: 'chicken', price: 15.00, pricingType: 'per-person' },

      // === MEAT & SEAFOOD ===
      { name: 'Pepper Steak', description: 'Sliced steak with peppers and onions.', category: 'meat-seafood', price: 15.00, pricingType: 'per-person' },
      { name: 'Sauteed Shrimp', description: 'Shrimp sauteed in garlic butter sauce.', category: 'meat-seafood', price: 15.00, pricingType: 'per-person' },
      { name: 'Stuffed Sole', description: 'Filet of sole stuffed with crabmeat.', category: 'meat-seafood', price: 15.00, pricingType: 'per-person' },
      { name: 'Virginia Ham', description: 'Sliced Virginia ham, oven-roasted.', category: 'meat-seafood', price: 15.00, pricingType: 'per-person' },
      { name: 'Spare Ribs', description: 'Slow-cooked spare ribs with tangy sauce.', category: 'meat-seafood', price: 15.00, pricingType: 'per-person' },
      { name: 'Sausage with Peppers', description: 'Italian sausage with sauteed peppers and onions.', category: 'meat-seafood', price: 15.00, pricingType: 'per-person' },
      { name: 'Meatballs', description: 'Homemade meatballs in marinara sauce.', category: 'meat-seafood', price: 15.00, pricingType: 'per-person' },
      { name: 'Buffalo Wings', description: 'Crispy buffalo wings with blue cheese dipping sauce.', category: 'meat-seafood', price: 15.00, pricingType: 'per-person' },

      // === VEGETABLES ===
      { name: 'Fried Eggplant', description: 'Lightly breaded and fried eggplant slices.', category: 'vegetables', price: 15.00, pricingType: 'per-person' },
      { name: 'Eggplant Parmigiana', description: 'Breaded eggplant with marinara and mozzarella.', category: 'vegetables', price: 15.00, pricingType: 'per-person' },
      { name: 'Eggplant Rollatini', description: 'Eggplant rolled with ricotta and baked in sauce.', category: 'vegetables', price: 15.00, pricingType: 'per-person' },
      { name: 'Sauteed Spinach', description: 'Fresh spinach sauteed with garlic and olive oil.', category: 'vegetables', price: 15.00, pricingType: 'per-person' },
      { name: 'Grilled Mixed Veggies', description: 'Seasonal mixed vegetables, grilled and seasoned.', category: 'vegetables', price: 15.00, pricingType: 'per-person' },
      { name: 'Sauteed Broccoli Rabe', description: 'Broccoli rabe sauteed with garlic and red pepper flakes.', category: 'vegetables', price: 15.00, pricingType: 'per-person' },
      { name: 'Sauteed Escarole', description: 'Escarole sauteed with garlic, olive oil, and white beans.', category: 'vegetables', price: 15.00, pricingType: 'per-person' },
      { name: 'Italian Hot Peppers and Onions', description: 'Hot peppers and onions sauteed in olive oil.', category: 'vegetables', price: 15.00, pricingType: 'per-person' },

      // === GROUP LUNCH PACKAGES ===
      { name: 'Florence Package', description: 'Assorted sandwiches/wraps, drinks (water/soda), pasta salad. 15-person minimum.', category: 'group-lunch', price: 14.00, pricingType: 'per-person' },
      { name: 'Venice Package', description: 'Assorted sandwiches/wraps, drinks, mozzarella tomato salad, pasta salad. 15-person minimum.', category: 'group-lunch', price: 16.00, pricingType: 'per-person' },
      { name: 'Roman Package', description: 'Assorted sandwiches/wraps, drinks, Italian sausage antipasto, imported cheese, mozzarella tomato salad, arugula salad with shaved parmigiano and balsamic vinaigrette, pasta salad. 15-person minimum.', category: 'group-lunch', price: 18.00, pricingType: 'per-person' },

      // === CATERING PACKAGES ===
      { name: 'Catering for 20', description: '3 hot trays + sandwich basket/stuffed focaccia, or 5 food trays. Includes bread.', category: 'catering-packages', price: 300.00, pricingType: 'per-package', servesCount: 20 },
      { name: 'Catering for 30', description: '5 hot trays + sandwich basket/stuffed focaccia, or 7 food trays. Includes bread.', category: 'catering-packages', price: 450.00, pricingType: 'per-package', servesCount: 30 },
      { name: 'Catering for 50', description: '8 hot trays + sandwich basket/stuffed focaccia, or 12 food trays. Includes bread.', category: 'catering-packages', price: 750.00, pricingType: 'per-package', servesCount: 50 },
      { name: 'Catering for 75', description: '12 hot trays + sandwich basket/stuffed focaccia, or 15 food trays. Includes bread.', category: 'catering-packages', price: 1125.00, pricingType: 'per-package', servesCount: 75 },
      { name: 'Catering for 100', description: '15 hot trays + sandwich basket/stuffed focaccia, or 20 food trays. Includes bread.', category: 'catering-packages', price: 1500.00, pricingType: 'per-package', servesCount: 100 },
    ];

    store.insertManyMenuItems(sampleItems);
    res.status(201).json({ message: `Seeded ${sampleItems.length} menu items.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to seed menu items.' });
  }
};
