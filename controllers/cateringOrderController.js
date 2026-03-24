const store = require('../data/store');
const { validationResult } = require('express-validator');

exports.createOrder = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { customerName, customerEmail, customerPhone, eventDate, eventTime, eventLocation, guestCount, items, specialInstructions } = req.body;

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const menuItem = store.getMenuItemById(item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({ error: `Menu item not found: ${item.menuItemId}` });
      }
      if (menuItem.isAvailable === false) {
        return res.status(400).json({ error: `Menu item is unavailable: ${menuItem.name}` });
      }

      const quantity = item.quantity;
      const itemSubtotal = menuItem.price * quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity,
        unitPrice: menuItem.price,
        subtotal: itemSubtotal,
      });
    }

    subtotal = Math.round(subtotal * 100) / 100;

    const order = store.createOrder({
      customerName,
      customerEmail,
      customerPhone,
      eventDate,
      eventTime,
      eventLocation,
      guestCount,
      items: orderItems,
      specialInstructions: specialInstructions || '',
      subtotal,
      total: subtotal,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order.' });
  }
};

exports.getOrder = (req, res) => {
  try {
    const order = store.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order.' });
  }
};

exports.getAllOrders = (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const orders = store.getAllOrders(filter);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};

exports.updateOrderStatus = (req, res) => {
  try {
    const { status } = req.body;
    const order = store.updateOrderStatus(req.params.id, status);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
