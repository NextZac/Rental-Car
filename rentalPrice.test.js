const { calculateRentalPrice, getCarClass } = require('./rentalPrice');

describe('calculateRentalPrice', () => {
    // Common inputs for all tests
    const pickup = "New York";
    const dropoff = "Los Angeles";
    const pickupDate = new Date('2025-05-31'); // High season
    const dropoffDate = new Date('2025-06-04'); // 5 days

    test('Scenario 1: 18-year-old with 2 years of license, Compact car', () => {
        const result = calculateRentalPrice(pickup, dropoff, pickupDate, dropoffDate, 18, 2, "Compact");
        expect(result.price).toBeCloseTo(18 * 5 * 1.3 * 1.15 + 15*5); // age * days * high season surcharge
    });

    test('Scenario 2: 18-year-old with 2 years of license, Racer car (not allowed)', () => {
        const result = calculateRentalPrice(pickup, dropoff, pickupDate, dropoffDate, 18, 2, "Racer");
        expect(result.price).toBeNull(); // Drivers 18-21 can only rent Compact cars
    });

    test('Scenario 3: 22-year-old with 1.5 years of license, Electric car', () => {
        const result = calculateRentalPrice(pickup, dropoff, pickupDate, dropoffDate, 22, 1.5, "Electric");
        expect(result.price).toBeCloseTo(22 * 5 * 1.3 * 1.15 + 15*5); // age * days * high season surcharge * license surcharge
    });

    test('Scenario 4: 25-year-old with 2.5 years of license, Racer car during high season', () => {
        const result = calculateRentalPrice(pickup, dropoff, pickupDate, dropoffDate, 25, 2.5, "Racer");
        expect(result.price).toBeCloseTo(25 * 5 * 1.15 * 1.5 + 15*5); // age * days * Racer surcharge * high season surcharge
    });

    test('Scenario 5: 30-year-old with 4 years of license, Cabrio car during low season (11 days)', () => {
        const lowSeasonPickupDate = new Date('2025-02-01'); // Low season
        const lowSeasonDropoffDate = new Date('2025-02-11'); // 11 days
        const result = calculateRentalPrice(pickup, dropoff, lowSeasonPickupDate, lowSeasonDropoffDate, 30, 4, "Cabrio");
        console.log(result);
        expect(result.price).toBeCloseTo(30 * 11 * 0.9); // age * days * low season discount
    });

    test('Scenario 6: 17-year-old with 1 year of license (not allowed)', () => {
        const result = calculateRentalPrice(pickup, dropoff, pickupDate, dropoffDate, 17, 1, "Compact");
        expect(result.error).toBe("Driver too young - cannot quote the price");
    });

    test('Scenario 7: 20-year-old with 0.5 years of license (not allowed)', () => {
        const result = calculateRentalPrice(pickup, dropoff, pickupDate, dropoffDate, 20, 0.5, "Compact");
        expect(result.error).toBe("Driver's license held for less than a year - cannot rent a car");
    });
});