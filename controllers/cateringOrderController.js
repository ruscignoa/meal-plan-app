const CateringOrder = require('../models/CateringOrder');
const MenuItem = require('../models/MenuItem');
const { validationResult } = require('express-validator');

exports.createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { customerName, customerEmail, customerPhone, eventDate, eventTime, eventLocation, guestCount, items, specialInstructions } = req.body;

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({ error: `Menu item not found: ${item.menuItemId}` });
      }
      if (!menuItem.isAvailable) {
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

    const order = new CateringOrder({
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

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order.' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await CateringOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order.' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const orders = await CateringOrder.find(filter).sort({ eventDate: 1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await CateringOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
