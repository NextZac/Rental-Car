const { calculatePrice, CAR_CLASSES } = require('./rentalPrice');

describe('calculatePrice', () => {
    const createDate = (dateString) => new Date(dateString);

    describe('Eligibility Scenarios', () => {
        test('Driver too young (17)', () => {
            const result = calculatePrice(
                createDate('2025-05-31'),
                createDate('2025-06-04'),
                "Compact",
                17,
                1
            );
            expect(result).toBe("Driver too young - cannot quote the price");
        });

        test('License held less than 1 year', () => {
            const result = calculatePrice(
                createDate('2025-05-31'),
                createDate('2025-06-04'),
                "Compact",
                20,
                0.5
            );
            expect(result).toBe("Driver must hold a license for at least 1 year");
        });

        test('Young driver (18-21) trying to rent non-Compact', () => {
            const result = calculatePrice(
                createDate('2025-05-31'),
                createDate('2025-06-04'),
                "Racer",
                20,
                2
            );
            expect(result).toBe("Drivers 21 y/o or less can only rent Compact vehicles");
        });
    });

    describe('Pricing Scenarios', () => {
        test('18-year-old, 2 years license, Compact car (high season)', () => {
            const result = calculatePrice(
                createDate('2025-05-31'), // Sat
                createDate('2025-06-04'), // Wed
                "Compact",
                18,
                2
            );
            expect(result).toBe('$195');
        });

        test('22-year-old, 1.5 years license, Electric car (high season)', () => {
            const result = calculatePrice(
                createDate('2025-05-31'), // Sat
                createDate('2025-06-04'), // Wed
                "Electric",
                22,
                1.5
            );
            expect(result).toBe('$285');
        });

        test('25-year-old, 2.5 years license, Racer car (high season)', () => {
            const result = calculatePrice(
                createDate('2025-05-31'), // Sat
                createDate('2025-06-04'), // Wed
                "Racer",
                25,
                2.5
            );
            expect(result).toBe('$356');
        });

        test('30-year-old, 4 years license, Cabrio car (low season, 11 days)', () => {
            const result = calculatePrice(
                createDate('2025-02-01'), // Sat
                createDate('2025-02-11'), // Tue
                "Cabrio",
                30,
                4
            );
            expect(result).toBe('$312');
        });
    });

    describe('Weekday/Weekend Pricing', () => {
        test('Monday to Wednesday (3 weekdays)', () => {
            const result = calculatePrice(
                createDate('2025-06-02'), // Mon
                createDate('2025-06-04'), // Wed
                "Compact",
                50,
                10
            );
            expect(result).toBe('$173');
        });

        test('Thursday to Saturday (2 weekdays + 1 weekend)', () => {
            const result = calculatePrice(
                createDate('2025-06-05'), // Thu
                createDate('2025-06-07'), // Sat
                "Compact",
                50,
                10
            );
            expect(result).toBe('$181');
        });

        test('Friday to Sunday (1 weekday + 2 weekend)', () => {
            const result = calculatePrice(
                createDate('2025-06-06'), // Fri
                createDate('2025-06-08'), // Sun
                "Compact",
                40,
                5
            );
            expect(result).toBe('$145');
        });

        test('Single weekday rental', () => {
            const result = calculatePrice(
                createDate('2025-06-03'), // Tue
                createDate('2025-06-03'), // Tue
                "Compact",
                35,
                3
            );
            expect(result).toBe('$40');
        });

        test('Single weekend day rental', () => {
            const result = calculatePrice(
                createDate('2025-06-07'), // Sat
                createDate('2025-06-07'), // Sat
                "Compact",
                35,
                3
            );
            expect(result).toBe('$42');
        });
    });
});