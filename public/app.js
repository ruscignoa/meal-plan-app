const API_BASE = '/api/catering';

const CATEGORY_LABELS = {
  'catering-packages': 'Catering Package',
  'group-lunch': 'Group Lunch',
  'sandwiches': 'Sandwich',
  'specialty-sandwiches': 'Specialty Sandwich',
  'pasta': 'Pasta',
  'chicken': 'Chicken',
  'meat-seafood': 'Meat & Seafood',
  'vegetables': 'Vegetables',
};

let menuItems = [];
let order = {}; // { menuItemId: { item, quantity } }
let activeCategory = 'all';

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  fetchMenu();
  setupFilters();
  setupCheckout();
  setMinDate();
});

async function fetchMenu() {
  try {
    const res = await fetch(`${API_BASE}/menu`);
    menuItems = await res.json();
    renderMenu();
  } catch {
    document.getElementById('menu-items').innerHTML =
      '<p style="color:#c62828;text-align:center;padding:20px;">Failed to load menu. Make sure the server is running and the database is seeded.<br><br>Run: <code>POST /api/catering/menu/seed</code></p>';
  }
}

function setMinDate() {
  const dateInput = document.getElementById('eventDate');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split('T')[0];
}

// --- Filtering ---
function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      renderMenu();
    });
  });
}

function getFilteredItems() {
  return menuItems.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    return true;
  });
}

// --- Render Menu ---
function renderMenu() {
  const container = document.getElementById('menu-items');
  const filtered = getFilteredItems();

  if (filtered.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#999;padding:30px;">No items match your filters.</p>';
    return;
  }

  container.innerHTML = filtered.map(item => {
    const qty = order[item._id]?.quantity || 0;
    const isPackage = item.category === 'catering-packages' || item.category === 'group-lunch';
    const priceLabel = getPriceLabel(item);

    return `
      <div class="menu-card${isPackage ? ' is-package' : ''}">
        <span class="category-badge">${CATEGORY_LABELS[item.category] || item.category}</span>
        <h3>${escapeHtml(item.name)}</h3>
        <p class="description">${escapeHtml(item.description)}</p>
        <div class="card-footer">
          <span class="price">$${item.price.toFixed(2)} <small>${priceLabel}</small></span>
          ${qty === 0
            ? `<button class="qty-btn add-btn" onclick="addItem('${item._id}')">+</button>`
            : `<div class="qty-control">
                <button class="qty-btn" onclick="decrementItem('${item._id}')">-</button>
                <span class="qty-value">${qty}</span>
                <button class="qty-btn" onclick="incrementItem('${item._id}')">+</button>
              </div>`
          }
        </div>
      </div>
    `;
  }).join('');
}

function getPriceLabel(item) {
  if (item.pricingType === 'per-person') return '/person';
  if (item.pricingType === 'per-package') return item.servesCount ? `/serves ${item.servesCount}` : '/package';
  return '/each';
}

// --- Order Management ---
function addItem(id) {
  const item = menuItems.find(i => i._id === id);
  if (!item) return;
  const defaultQty = item.pricingType === 'per-package' ? 1 : (item.pricingType === 'per-person' ? 15 : 5);
  order[id] = { item, quantity: defaultQty };
  updateUI();
}

function incrementItem(id) {
  if (order[id]) {
    order[id].quantity++;
    updateUI();
  }
}

function decrementItem(id) {
  if (order[id]) {
    order[id].quantity--;
    if (order[id].quantity <= 0) {
      delete order[id];
    }
    updateUI();
  }
}

function removeItem(id) {
  delete order[id];
  updateUI();
}

function updateUI() {
  renderMenu();
  renderOrderSummary();
}

function renderOrderSummary() {
  const container = document.getElementById('order-items');
  const totalsEl = document.getElementById('order-totals');
  const checkoutBtn = document.getElementById('checkout-btn');
  const entries = Object.entries(order);

  if (entries.length === 0) {
    container.innerHTML = '<p class="empty-order">No items selected yet. Browse the menu to get started!</p>';
    totalsEl.style.display = 'none';
    checkoutBtn.disabled = true;
    return;
  }

  let total = 0;
  container.innerHTML = entries.map(([id, { item, quantity }]) => {
    const itemTotal = item.price * quantity;
    total += itemTotal;
    const detail = getOrderItemDetail(item, quantity);
    return `
      <div class="order-item">
        <div class="item-info">
          <div class="item-name">${escapeHtml(item.name)}</div>
          <div class="item-detail">${detail}</div>
        </div>
        <span class="item-price">$${itemTotal.toFixed(2)}</span>
        <button class="remove-btn" onclick="removeItem('${id}')" title="Remove">&times;</button>
      </div>
    `;
  }).join('');

  document.getElementById('total').textContent = `$${total.toFixed(2)}`;
  totalsEl.style.display = 'block';
  checkoutBtn.disabled = false;
}

function getOrderItemDetail(item, quantity) {
  if (item.pricingType === 'per-package') return `${quantity} package(s)`;
  if (item.pricingType === 'per-person') return `${quantity} people x $${item.price.toFixed(2)}`;
  return `${quantity} x $${item.price.toFixed(2)}`;
}

// --- Checkout ---
function setupCheckout() {
  document.getElementById('checkout-btn').addEventListener('click', openCheckoutModal);
  document.getElementById('modal-close').addEventListener('click', closeCheckoutModal);
  document.getElementById('checkout-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeCheckoutModal();
  });
  document.getElementById('order-form').addEventListener('submit', submitOrder);
}

function openCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const modalItems = document.getElementById('modal-order-items');
  const entries = Object.entries(order);

  let total = 0;
  modalItems.innerHTML = entries.map(([id, { item, quantity }]) => {
    const itemTotal = item.price * quantity;
    total += itemTotal;
    const detail = getOrderItemDetail(item, quantity);
    return `<div class="summary-item"><span>${escapeHtml(item.name)} (${detail})</span><span>$${itemTotal.toFixed(2)}</span></div>`;
  }).join('');

  document.getElementById('modal-total').textContent = `$${total.toFixed(2)}`;
  modal.style.display = 'flex';
}

function closeCheckoutModal() {
  document.getElementById('checkout-modal').style.display = 'none';
}

async function submitOrder(e) {
  e.preventDefault();

  const items = Object.entries(order).map(([id, { quantity }]) => ({
    menuItemId: id,
    quantity,
  }));

  const payload = {
    customerName: document.getElementById('customerName').value.trim(),
    customerEmail: document.getElementById('customerEmail').value.trim(),
    customerPhone: document.getElementById('customerPhone').value.trim(),
    eventDate: document.getElementById('eventDate').value,
    eventTime: document.getElementById('eventTime').value,
    eventLocation: document.getElementById('eventLocation').value.trim(),
    guestCount: parseInt(document.getElementById('guestCount').value, 10),
    specialInstructions: document.getElementById('specialInstructions').value.trim(),
    items,
  };

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Placing Order...';

  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || err.errors?.map(e => e.msg).join(', ') || 'Failed to place order');
    }

    const result = await res.json();
    showConfirmation(result);
  } catch (err) {
    alert('Error: ' + err.message);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Place Order';
  }
}

function showConfirmation(result) {
  document.getElementById('checkout-modal').style.display = 'none';
  document.querySelector('.builder-layout').style.display = 'none';
  document.getElementById('confirm-email').textContent = result.customerEmail;
  document.getElementById('confirm-id').textContent = result._id;
  document.getElementById('confirmation').style.display = 'block';
}

// --- Utilities ---
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
