const express = require('express');
const bodyParser = require('body-parser');
const rental = require('./rentalPrice');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use('/pictures', express.static('images'));

const formHtml = fs.readFileSync('form.html', 'utf8');
const resultHtml = fs.readFileSync('result.html', 'utf8');

app.post('/', (req, res) => {
    const post = req.body;
    const carClasses = ["Compact", "Electric", "Cabrio", "Racer"];
    const results = carClasses.map(carClass => {
        return rental.calculateRentalPrice(
            String(post.pickup),
            String(post.dropoff),
            Date.parse(post.pickupdate),
            Date.parse(post.dropoffdate),
            Number(post.age),
            Number(post.licenseDuration),
            carClass
        );
    });

    let resultDisplay = '<ul class="car-list">';
    results.forEach(result => {
        if (result.price !== null) {
            resultDisplay += `
                <li class="car-item">
                    <div class="car-details">
                        <div class="car-name">${result.carClass} Car</div>
                        <div class="car-price">Price: $${result.price.toFixed(2)} per day</div>
                    </div>
                </li>
            `;
        } else {
            resultDisplay += `
                <li class="car-item">
                    <div class="car-details">
                        <div class="car-name">${result.carClass} Car</div>
                        <div class="car-price">Price: Not available</div>
                    </div>
                </li>
            `;
        }
    });
    resultDisplay += '</ul>';

    res.send(formHtml + resultDisplay);
});

app.get('/', (req, res) => {
    res.send(formHtml);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});