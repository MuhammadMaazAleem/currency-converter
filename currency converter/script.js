// API Base URL for currency conversion
const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

// DOM Elements
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const fromFlag = document.getElementById("from-flag");
const toFlag = document.getElementById("to-flag");
const amountInput = document.getElementById("amount-input");
const exchangeMsg = document.getElementById("exchange-msg");
const swapBtn = document.getElementById("swap-btn");
const form = document.getElementById("currency-form");

// Get currency to country mapping
const currencyToCountry = {};
for (const [country, currency] of Object.entries(countryList)) {
    currencyToCountry[currency] = country;
}

// Populate currency dropdowns
function populateDropdowns() {
    // Get unique currencies
    const currencies = [...new Set(Object.values(countryList))].sort();
    
    // Clear and populate dropdowns
    [fromCurrency, toCurrency].forEach(dropdown => {
        dropdown.innerHTML = currencies
            .map(currency => `<option value="${currency}">${currency}</option>`)
            .join('');
    });

    // Set default selections
    fromCurrency.value = "USD";
    toCurrency.value = "PKR";
}

// Update flag images when currency changes
function updateFlag(select, flagImg) {
    const currency = select.value;
    const country = currencyToCountry[currency];
    if (country) {
        flagImg.src = `https://flagsapi.com/${country}/flat/64.png`;
        flagImg.alt = `${currency} Flag`;
    }
}

// Swap currencies
function swapCurrencies() {
    [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
    updateFlag(fromCurrency, fromFlag);
    updateFlag(toCurrency, toFlag);
    getExchangeRate();
}

// Get and display exchange rate
async function getExchangeRate() {
    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) {
        exchangeMsg.innerText = "Please enter a valid amount";
        return;
    }

    try {
        exchangeMsg.innerText = "Getting exchange rate...";
        
        const from = fromCurrency.value.toUpperCase();
        const to = toCurrency.value.toUpperCase();
        
        if (from === to) {
            exchangeMsg.innerText = `${amount} ${from} = ${amount} ${to}`;
            return;
        }

        // Fetch exchange rate from the API
        const response = await fetch(`${BASE_URL}/${from}`);
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rate');
        }
        
        const data = await response.json();
        if (!data.rates) {
            throw new Error('Invalid exchange rate data');
        }
        
        const rate = data.rates[to];
        const convertedAmount = (amount * rate).toFixed(2);
        exchangeMsg.innerText = `${amount} ${from} = ${convertedAmount} ${to}`;
    } catch (error) {
        exchangeMsg.innerText = "Could not get exchange rate. Please try again later.";
        console.error('Exchange rate error:', error);
    }
}

// Event Listeners
fromCurrency.addEventListener("change", () => {
    updateFlag(fromCurrency, fromFlag);
    getExchangeRate();
});

toCurrency.addEventListener("change", () => {
    updateFlag(toCurrency, toFlag);
    getExchangeRate();
});

swapBtn.addEventListener("click", swapCurrencies);

form.addEventListener("submit", (e) => {
    e.preventDefault();
    getExchangeRate();
});

// Initialize everything when page loads
document.addEventListener("DOMContentLoaded", () => {
    populateDropdowns();
    updateFlag(fromCurrency, fromFlag);
    updateFlag(toCurrency, toFlag);
    getExchangeRate();
});
