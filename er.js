// Exchange Rates and Currency Symbols
const exchangeRates = {
  "base": "USD",
  "date": "2022-09-24",
  "rates": {
    "AUD": 1.531863,
    "CAD": 1.36029,
    "CLP": 950.662057,
    "CNY": 7.128404,
    "EUR": 1.03203,
    "GBP": 0.920938,
    "INR": 81.255504,
    "JPY": 143.376504,
    "RUB": 57.875038,
    "ZAR": 17.92624
  }
};

const currencySymbols = {
  "AUD": "Australian Dollar",
  "CAD": "Canadian Dollar",
  "CLP": "Chilean Peso",
  "CNY": "Chinese Yuan",
  "EUR": "Euro",
  "GBP": "British Pound Sterling",
  "INR": "Indian Rupee",
  "JPY": "Japanese Yen",
  "RUB": "Russian Ruble",
  "USD": "United States Dollar",
  "ZAR": "South African Rand",
};
// Function to convert an amount from one currency to another.
function convertCurrency(amount, fromCurrency, toCurrency) {
  amount = parseFloat(amount);
  if (isNaN(amount)) {
    return "Invalid amount.";
  }

  // Check if 'from' and 'to' currencies are the same, return the formatted amount
  if (fromCurrency === toCurrency) {
    return `${formatCurrency(amount)} ${currencySymbols[fromCurrency]}`;
  }

  let convertedAmount;
  if (fromCurrency === exchangeRates.base) {
    convertedAmount = amount * exchangeRates.rates[toCurrency];
  } else if (toCurrency === exchangeRates.base) {
    convertedAmount = amount / exchangeRates.rates[fromCurrency];
  } else {
    const rateToBase = 1 / exchangeRates.rates[fromCurrency];
    const rateFromBase = exchangeRates.rates[toCurrency];
    convertedAmount = amount * rateToBase * rateFromBase;
  }
  return `${formatCurrency(amount)} ${currencySymbols[fromCurrency]} is equal to ${formatCurrency(convertedAmount)} ${currencySymbols[toCurrency]}`;
}

// Function to format a numeric value as a currency string with two decimal places and commas.
function formatCurrency(value) {
  return parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
// Function to create an HTML table with conversion values for set increments.
function createConversionTable(fromCurrency, toCurrency) {
  const increments = [1, 5, 10, 25, 50, 100, 500, 1000, 5000, 10000];
  let tableHTML = '<table>';
  tableHTML += `<tr><th>Amount (${currencySymbols[fromCurrency]})</th><th>Converted (${currencySymbols[toCurrency]})</th></tr>`;
  
  increments.forEach((inc) => {
    let conversionResult = convertCurrency(inc, fromCurrency, toCurrency);
    let convertedValue = conversionResult && conversionResult.split(' is equal to ')[1];
    
    if (!convertedValue) {
      convertedValue = `${formatCurrency(inc)} ${currencySymbols[toCurrency]}`;
    }    
    tableHTML += `<tr><td>${formatCurrency(inc)}</td><td>${convertedValue}</td></tr>`;
  });

  tableHTML += '</table>';
  return tableHTML;
}

// Event listeners that run after the DOM has fully loaded.
document.addEventListener('DOMContentLoaded', () => {
  const convertButton = document.getElementById("convertButton");
  const switchButton = document.getElementById("switchButton");
  const fromCurrencySelect = document.getElementById("fromCurrency");
  const toCurrencySelect = document.getElementById("toCurrency");
  const amountInput = document.getElementById("amount");
  const resultDiv = document.getElementById("result");
  const commonIncrementsDiv = document.getElementById('commonIncrements');

  // Event listener for the currency switch button.
  switchButton.addEventListener("click", () => {
    let temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
  });

  // Event listener for the currency convert button.
  convertButton.addEventListener("click", () => {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const amount = amountInput.value;

    if (isNaN(parseFloat(amount)) || amount === '') {
      alert("Please enter a valid number for the amount.");
      return; // Exit if the amount is not a number
    }

    const conversionResult = convertCurrency(amount, fromCurrency, toCurrency);
    resultDiv.textContent = conversionResult;
    resultDiv.style.display = 'block'; // Make the result visible

    commonIncrementsDiv.innerHTML = createConversionTable(fromCurrency, toCurrency);
    commonIncrementsDiv.style.display = 'block'; // Make the tables visible
  });
});
// Input element for user input and suggestions 
const userInput = document.getElementById("userInput");
const suggestionsDiv = document.getElementById("suggestions");

// Function to look up currency based on the partial string
function lookupCurrency(partialString) {
  const result = [];
  partialString = partialString.toLowerCase();
  
  // Iterate through the currencySymbols object
  for (const code in currencySymbols) {
    const currencyName = currencySymbols[code];
    // Check if code or name includes the partial string
    if (code.toLowerCase().includes(partialString) || currencyName.toLowerCase().includes(partialString)) {
      result.push(`${code} - ${currencyName}`);
    }
  }
  return result;
}

// Add event listener to input element for user input
userInput.addEventListener("input", function() {
  const partialString = userInput.value;
  suggestionsDiv.innerHTML = ""; // Clear previous suggestions
  
  // If there is user input, show suggestions
  if (partialString) {
    const suggestions = lookupCurrency(partialString);
    suggestions.forEach((suggestionText) => {
      const suggestionElement = document.createElement("div");
      suggestionElement.textContent = suggestionText;
      suggestionElement.classList.add('suggestion');
      suggestionElement.addEventListener("click", function() {
        userInput.value = suggestionText.split(' - ')[0];
        suggestionsDiv.innerHTML = ""; // Clear suggestions after selection
      });
      suggestionsDiv.appendChild(suggestionElement);
    });
  }
});