const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const menuCtrl = require('../controllers/menuItemController');
const orderCtrl = require('../controllers/cateringOrderController');

// --- Menu Items ---
router.get('/menu', menuCtrl.getAllMenuItems);
router.post('/menu', menuCtrl.createMenuItem);
router.put('/menu/:id', menuCtrl.updateMenuItem);
router.delete('/menu/:id', menuCtrl.deleteMenuItem);
router.post('/menu/seed', menuCtrl.seedMenuItems);

// --- Catering Orders ---
router.get('/orders', orderCtrl.getAllOrders);
router.get('/orders/:id', orderCtrl.getOrder);

router.post('/orders', [
  body('customerName').trim().notEmpty().withMessage('Customer name is required.'),
  body('customerEmail').isEmail().withMessage('Valid email is required.'),
  body('customerPhone').trim().notEmpty().withMessage('Phone number is required.'),
  body('eventDate').isISO8601().withMessage('Valid event date is required.'),
  body('eventTime').trim().notEmpty().withMessage('Event time is required.'),
  body('eventLocation').trim().notEmpty().withMessage('Event location is required.'),
  body('guestCount').isInt({ min: 1 }).withMessage('Guest count must be at least 1.'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required.'),
  body('items.*.menuItemId').notEmpty().withMessage('Menu item ID is required.'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1.'),
], orderCtrl.createOrder);

router.patch('/orders/:id/status', [
  body('status').isIn(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Invalid status.'),
], orderCtrl.updateOrderStatus);

module.exports = router;
