const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname);
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

// --- Menu Items ---

function getAllMenuItems(filter = {}) {
  let items = readJSON(MENU_FILE);
  if (filter.category) {
    items = items.filter(i => i.category === filter.category);
  }
  items = items.filter(i => i.isAvailable !== false);
  return items.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}

function getMenuItemById(id) {
  const items = readJSON(MENU_FILE);
  return items.find(i => i._id === id) || null;
}

function createMenuItem(data) {
  const items = readJSON(MENU_FILE);
  const item = { _id: generateId(), ...data, isAvailable: true, createdAt: new Date().toISOString() };
  items.push(item);
  writeJSON(MENU_FILE, items);
  return item;
}

function updateMenuItem(id, data) {
  const items = readJSON(MENU_FILE);
  const idx = items.findIndex(i => i._id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data };
  writeJSON(MENU_FILE, items);
  return items[idx];
}

function deleteMenuItem(id) {
  const items = readJSON(MENU_FILE);
  const idx = items.findIndex(i => i._id === id);
  if (idx === -1) return null;
  const removed = items.splice(idx, 1)[0];
  writeJSON(MENU_FILE, items);
  return removed;
}

function countMenuItems() {
  return readJSON(MENU_FILE).length;
}

function insertManyMenuItems(itemsData) {
  const items = itemsData.map(d => ({ _id: generateId(), ...d, isAvailable: true, createdAt: new Date().toISOString() }));
  writeJSON(MENU_FILE, items);
  return items;
}

// --- Orders ---

function getAllOrders(filter = {}) {
  let orders = readJSON(ORDERS_FILE);
  if (filter.status) {
    orders = orders.filter(o => o.status === filter.status);
  }
  return orders.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
}

function getOrderById(id) {
  const orders = readJSON(ORDERS_FILE);
  return orders.find(o => o._id === id) || null;
}

function createOrder(data) {
  const orders = readJSON(ORDERS_FILE);
  const order = { _id: generateId(), ...data, status: 'pending', createdAt: new Date().toISOString() };
  orders.push(order);
  writeJSON(ORDERS_FILE, orders);
  return order;
}

function updateOrderStatus(id, status) {
  const orders = readJSON(ORDERS_FILE);
  const idx = orders.findIndex(o => o._id === id);
  if (idx === -1) return null;
  orders[idx].status = status;
  writeJSON(ORDERS_FILE, orders);
  return orders[idx];
}

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  countMenuItems,
  insertManyMenuItems,
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
};
