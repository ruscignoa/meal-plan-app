const MenuItem = require('../models/MenuItem');

exports.getAllMenuItems = async (req, res) => {
  try {
    const filter = { isAvailable: true };
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu items.' });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ error: 'Menu item not found.' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Menu item not found.' });
    res.json({ message: 'Menu item deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete menu item.' });
  }
};

exports.seedMenuItems = async (req, res) => {
  try {
    const existing = await MenuItem.countDocuments();
    if (existing > 0) {
      return res.status(400).json({ error: 'Menu already has items. Delete them first to re-seed.' });
    }

    const sampleItems = [
      { name: 'Bruschetta', description: 'Toasted bread topped with fresh tomatoes, basil, and balsamic glaze.', category: 'appetizers', pricePerPerson: 3.50, minimumOrder: 10, dietaryTags: ['vegetarian'] },
      { name: 'Shrimp Cocktail', description: 'Chilled jumbo shrimp served with zesty cocktail sauce.', category: 'appetizers', pricePerPerson: 5.00, minimumOrder: 10, dietaryTags: ['gluten-free', 'dairy-free'] },
      { name: 'Stuffed Mushrooms', description: 'Baby portobello mushrooms filled with herbed cream cheese.', category: 'appetizers', pricePerPerson: 4.00, minimumOrder: 10, dietaryTags: ['vegetarian', 'gluten-free'] },
      { name: 'Spring Rolls', description: 'Crispy vegetable spring rolls with sweet chili dipping sauce.', category: 'appetizers', pricePerPerson: 3.00, minimumOrder: 10, dietaryTags: ['vegan'] },

      { name: 'Grilled Chicken Breast', description: 'Herb-marinated chicken breast with lemon pan sauce.', category: 'entrees', pricePerPerson: 12.00, minimumOrder: 10, dietaryTags: ['gluten-free', 'dairy-free'] },
      { name: 'Beef Tenderloin', description: 'Slow-roasted beef tenderloin with red wine reduction.', category: 'entrees', pricePerPerson: 18.00, minimumOrder: 10, dietaryTags: ['gluten-free'] },
      { name: 'Pan-Seared Salmon', description: 'Atlantic salmon with dill cream sauce and capers.', category: 'entrees', pricePerPerson: 15.00, minimumOrder: 10, dietaryTags: ['gluten-free'] },
      { name: 'Eggplant Parmesan', description: 'Breaded eggplant layered with marinara and mozzarella.', category: 'entrees', pricePerPerson: 10.00, minimumOrder: 10, dietaryTags: ['vegetarian'] },
      { name: 'Grilled Tofu Steak', description: 'Marinated tofu with teriyaki glaze and sesame seeds.', category: 'entrees', pricePerPerson: 9.00, minimumOrder: 10, dietaryTags: ['vegan', 'gluten-free'] },

      { name: 'Roasted Vegetables', description: 'Seasonal vegetables roasted with olive oil and herbs.', category: 'sides', pricePerPerson: 4.00, minimumOrder: 10, dietaryTags: ['vegan', 'gluten-free'] },
      { name: 'Caesar Salad', description: 'Crisp romaine with classic Caesar dressing and croutons.', category: 'sides', pricePerPerson: 3.50, minimumOrder: 10, dietaryTags: ['vegetarian'] },
      { name: 'Garlic Mashed Potatoes', description: 'Creamy mashed potatoes with roasted garlic and butter.', category: 'sides', pricePerPerson: 3.00, minimumOrder: 10, dietaryTags: ['vegetarian', 'gluten-free'] },
      { name: 'Rice Pilaf', description: 'Fluffy long-grain rice with herbs and toasted almonds.', category: 'sides', pricePerPerson: 2.50, minimumOrder: 10, dietaryTags: ['vegan'] },

      { name: 'Chocolate Mousse', description: 'Rich dark chocolate mousse topped with whipped cream.', category: 'desserts', pricePerPerson: 5.00, minimumOrder: 10, dietaryTags: ['vegetarian', 'gluten-free'] },
      { name: 'Tiramisu', description: 'Classic Italian coffee-flavored layered dessert.', category: 'desserts', pricePerPerson: 5.50, minimumOrder: 10, dietaryTags: ['vegetarian'] },
      { name: 'Fresh Fruit Platter', description: 'Assortment of seasonal fresh fruits.', category: 'desserts', pricePerPerson: 3.50, minimumOrder: 10, dietaryTags: ['vegan', 'gluten-free', 'nut-free'] },
      { name: 'Mini Cheesecakes', description: 'Assorted mini cheesecakes with berry compote.', category: 'desserts', pricePerPerson: 4.50, minimumOrder: 10, dietaryTags: ['vegetarian'] },

      { name: 'Iced Tea', description: 'Freshly brewed iced tea with lemon.', category: 'beverages', pricePerPerson: 2.00, minimumOrder: 10, dietaryTags: ['vegan', 'gluten-free'] },
      { name: 'Lemonade', description: 'House-made lemonade with fresh lemons and mint.', category: 'beverages', pricePerPerson: 2.50, minimumOrder: 10, dietaryTags: ['vegan', 'gluten-free'] },
      { name: 'Coffee Service', description: 'Regular and decaf coffee with cream and sugar.', category: 'beverages', pricePerPerson: 2.00, minimumOrder: 10, dietaryTags: ['vegetarian', 'gluten-free'] },
    ];

    await MenuItem.insertMany(sampleItems);
    res.status(201).json({ message: `Seeded ${sampleItems.length} menu items.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to seed menu items.' });
  }
};
