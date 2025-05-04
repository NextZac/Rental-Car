const CAR_CLASSES = ["Compact", "Electric", "Cabrio", "Racer"];
const HIGH_SEASON_MONTHS = [4, 5, 6, 7, 8, 9, 10]; // April-October
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function calculatePrice(pickupDate, dropoffDate, carType, driverAge, licenseDuration) {
  // Input validation and initialization
  carType = validateCarType(carType);
  const rentalDays = calculateRentalDays(pickupDate, dropoffDate);
  const season = determineSeason(pickupDate, dropoffDate);
  
  // Eligibility checks
  const eligibilityError = checkEligibility(driverAge, licenseDuration, carType);
  if (eligibilityError) return eligibilityError;

  // Calculate base price
  let price = calculateBasePrice(driverAge, rentalDays, pickupDate, dropoffDate);
  
  // Apply all pricing adjustments
  price = applyPricingAdjustments(price, {
    driverAge,
    licenseDuration,
    carType,
    season,
    rentalDays
  });

  return formatPrice(price);
}

// Helper functions
function validateCarType(type) {
  return CAR_CLASSES.includes(type) ? type : "Unknown";
}

function calculateRentalDays(start, end) {
  return Math.round(Math.abs((end - start) / ONE_DAY_MS)) + 1;
}

function determineSeason(start, end) {
  const startMonth = start.getMonth() + 1;
  const endMonth = end.getMonth() + 1;
  
  const isLowSeason = 
    !HIGH_SEASON_MONTHS.includes(startMonth) && 
    !HIGH_SEASON_MONTHS.includes(endMonth);
    
  return isLowSeason ? "Low" : "High";
}

function checkEligibility(age, licenseAge, carType) {
  if (age < 18) return "Driver too young - cannot quote the price";
  if (licenseAge < 1) return "Driver must hold a license for at least 1 year";
  if (age <= 21 && carType !== "Compact") {
    return "Drivers 21 y/o or less can only rent Compact vehicles";
  }
  return null;
}

function calculateBasePrice(age, days, pickupDate, dropoffDate) {
  const basePrice = age * days;
  return includesWeekend(pickupDate, dropoffDate) ? basePrice * 1.05 : basePrice;
}

function includesWeekend(start, end) {
  if ((end - start) > 5 * ONE_DAY_MS) return true;
  
  const startDay = start.getDay();
  const endDay = end.getDay();
  return startDay === 0 || startDay === 6 || 
         endDay === 0 || endDay === 6 || 
         startDay > endDay;
}

function applyPricingAdjustments(basePrice, factors) {
  let price = basePrice;
  
  // License duration adjustments
  if (factors.licenseDuration < 3 && factors.season === "High") {
    price += 15 * factors.rentalDays;
  }
  if (factors.licenseDuration < 2) {
    price *= 1.3;
  }

  // Car type adjustments
  if (factors.carType === "Racer" && factors.driverAge <= 25 && factors.season === "High") {
    price *= 1.5;
  }

  // Seasonal adjustments
  if (factors.season === "High") {
    price *= 1.15;
  } else if (factors.rentalDays > 10) {
    price *= 0.9;
  }

  return price;
}

function formatPrice(amount) {
  return `$${Math.round(amount)}`;
}

module.exports = {
  calculatePrice,
  CAR_CLASSES,
  validateCarType,
  calculateRentalDays,
  determineSeason,
  includesWeekend
};