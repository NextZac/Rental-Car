function calculateRentalPrice(pickup, dropoff, pickupDate, dropoffDate, age, licenseDuration, carClass) {
    const rentalDays = getRentalDays(pickupDate, dropoffDate);
    const season = getSeason(pickupDate, dropoffDate);
    // Check eligibility based on age
    if (age < 18) {
        return { error: "Driver too young - cannot quote the price" };
    }
  
    // Check eligibility based on license duration
    if (licenseDuration < 1) {
        return { error: "Driver's license held for less than a year - cannot rent a car" };
    }
  
    // Restrict drivers aged 18-21 to Compact vehicles
    if (age <= 21 && carClass !== "Compact") {
        return { price: null, carClass }; // No price for non-Compact vehicles for drivers aged 18-21
    }
  
    // Calculate base rental price
    let rentalPrice = age * rentalDays;
  
    // Apply Racer surcharge for drivers 25 or younger during high season
    if (carClass === "Racer" && age <= 25 && season === "High") {
        rentalPrice *= 1.5;
    }
  
    // Apply high season surcharge
    if (season === "High") {
        rentalPrice *= 1.15;
    }
  
    // Apply discount for rentals longer than 10 days during low season
    if (rentalDays > 10 && season === "Low") {
        rentalPrice *= 0.9;
    }
  
    // Apply surcharge for drivers with less than 2 years of license duration
    if (licenseDuration <= 2) {
        rentalPrice *= 1.3;
    }
  
    // Apply additional fee for drivers with less than 3 years of license duration during high season
    if (licenseDuration <= 3 && season === "High") {
        rentalPrice += 15 * rentalDays;
    }
  
    return { price: rentalPrice, carClass };
  }
  
  function getCarClass(type) {
    switch (type) {
        case "compact":
            return "Compact";
        case "electric":
            return "Electric";
        case "cabrio":
            return "Cabrio";
        case "racer":
            return "Racer";
        default:
            return "Unknown";
    }
  }
  
  function getRentalDays(pickupDate, dropoffDate) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(pickupDate);
    const secondDate = new Date(dropoffDate);
  
    return Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
  }
  
  function getSeason(pickupDate, dropoffDate) {
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);
  
    const start = 4; // April (0-indexed month)
    const end = 10; // October (0-indexed month)
  
    const pickupMonth = pickup.getMonth();
    const dropoffMonth = dropoff.getMonth();
  
    if (
        (pickupMonth >= start && pickupMonth <= end) ||
        (dropoffMonth >= start && dropoffMonth <= end) ||
        (pickupMonth < start && dropoffMonth > end)
    ) {
        return "High";
    } else {
        return "Low";
    }
  }
  
  exports.calculateRentalPrice = calculateRentalPrice;
  exports.getCarClass = getCarClass;