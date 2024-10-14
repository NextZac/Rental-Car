function getPrice(pickup, dropoff, pickupDate, dropoffDate, type, age) {
  const carClass = formatCarClass(type);
  const rentalDays = getRentalDays(pickupDate, dropoffDate);
  const season = determineSeason(pickupDate, dropoffDate);
  const price = calculatePrice(age, carClass, rentalDays, season);

  return {
    carClass,
    price: typeof price === "number" ? `$${price}` : price,
  };
}

function formatCarClass(type) {
  return type ? type.charAt(0).toUpperCase() + type.slice(1) : "Compact";
}

function calculatePrice(age, carClass, rentalDays, season) {
  if (age < 18) return "Driver too young - cannot quote the price";
  if (age <= 21 && carClass !== "Compact") {
    return "Drivers 21 y/o or less can only rent Compact vehicles";
  }

  let basePrice = age * rentalDays;

  if (age <= 25 && carClass === "Racer" && season === "High") {
    basePrice *= 1.5;
  }

  if (season === "High") {
    basePrice *= 1.15;
  }

  if (rentalDays > 10 && season === "Low") {
    basePrice *= 0.9;
  }

  return Math.round(basePrice * 100) / 100;
}

function getRentalDays(pickupDate, dropoffDate) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const pickup = new Date(pickupDate);
  const dropoff = new Date(dropoffDate);

  return Math.round(Math.abs((pickup - dropoff) / oneDay)) + 1;
}

function determineSeason(pickupDate, dropoffDate) {
  const pickupMonth = new Date(pickupDate).getMonth();
  const dropoffMonth = new Date(dropoffDate).getMonth();

  const highSeasonStart = 3; // Jaanuari index on 0, sellega on aprill 3 ja oktoober 9
  const highSeasonEnd = 9;

  const isHighSeason =
    (pickupMonth >= highSeasonStart && pickupMonth <= highSeasonEnd) ||
    (dropoffMonth >= highSeasonStart && dropoffMonth <= highSeasonEnd) ||
    (pickupMonth < highSeasonStart && dropoffMonth > highSeasonEnd);

  return isHighSeason ? "High" : "Low";
}

exports.getPrice = getPrice;
