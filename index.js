const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rental = require('./rentalPrice');
const fs = require('fs').promises;

// Configuration
const PORT = process.env.PORT || 3000;

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Load templates at startup
let templates;
async function loadTemplates() {
  try {
    templates = {
      form: await fs.readFile('form.html', 'utf8'),
      result: await fs.readFile('result.html', 'utf8')
    };
  } catch (error) {
    console.error('Failed to load templates:', error);
    process.exit(1);
  }
}

// Routes
app.post('/', handleRentalRequest);
app.get('/', serveForm);

// Start server
async function startServer() {
  await loadTemplates();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Route handlers
async function serveForm(req, res) {
  res.send(templates.form);
}

async function handleRentalRequest(req, res) {
  try {
    const {
      pickup,
      dropoff,
      pickupdate,
      dropoffdate,
      age,
      licenseDuration
    } = req.body;

    const results = calculateAllCarPrices(
      pickup,
      dropoff,
      pickupdate,
      dropoffdate,
      age,
      licenseDuration
    );

    const resultsHtml = renderResults(results);
    res.send(templates.form + resultsHtml);
  } catch (error) {
    console.error('Rental request error:', error);
    res.status(500).send('Error processing your request');
  }
}

// Business logic helpers
function calculateAllCarPrices(pickup, dropoff, pickupdate, dropoffdate, age, licenseDuration) {
  return Object.values(rental.CAR_CLASSES).map(carClass => {
    if (carClass === rental.CAR_CLASSES.UNKNOWN) return null;
    
    const pickupDate = new Date(pickupdate);
    const dropoffDate = new Date(dropoffdate);
    const price = rental.calculatePrice(
      pickupDate,
      dropoffDate,
      carClass,
      Number(age),
      Number(licenseDuration)
    );

    return {
      carClass,
      price
    };
  }).filter(Boolean);
}

function renderResults(results) {
  const items = results.map(result => `
    <li class="car-item">
      <div class="car-details">
        <div class="car-name">${result.carClass} Car</div>
        <div class="car-price">
          ${result.price 
            ? `Price: ${result.price} per day` 
            : 'Price: Not available'}
        </div>
      </div>
    </li>
  `).join('');

  return `<ul class="car-list">${items}</ul>`;
}

// Start the application
startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});