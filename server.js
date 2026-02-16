// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const mealRoutes = require('./routes/mealRoutes');
app.use('/api/meals', mealRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
