// const BASE_URL = "https://api.exchangerate.host/convert";
// const ACCESS_KEY = "5c7c365e124c5a68e7868f09af72e2b6";
const BASE_URL = "https://v6.exchangerate-api.com/v6";
const ACCESS_KEY = "d9f68aa75d55e822b1916a80";

const amountInput = document.querySelector(".amount");
const resultInput = document.querySelector(".result");
const fromButtons = document.querySelectorAll(".from .buttons button");
const toButtons = document.querySelectorAll(".to .buttons button");
const rub = document.querySelector(".from .rub");
const usd = document.querySelector(".to .usd");
const fromSpan = document.querySelector(".from span");
const toSpan = document.querySelector(".to span");
const container = document.querySelector(".container");
const header = document.querySelector("header");
const main = document.querySelector("main");
const error = document.querySelector(".error");
const hamburger = document.querySelector(".hamburger-menu");
const sidebar = document.querySelector("nav");
const links = document.querySelectorAll("a");
links.forEach((link) => {
  link.addEventListener("click", () => {
    links.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

hamburger.addEventListener("click", () => {
  if (sidebar.classList == "") {
    sidebar.classList.add("sidebar");
  } else {
    sidebar.classList.remove("sidebar");
  }
});
let fromCurrency = "RUB";
let toCurrency = "USD";

amountInput.value = 5000;
let base = fromCurrency;

let amount = amountInput.value;
amountInput.addEventListener("input", () => {
  amount = amountInput.value.replace(",", ".");
  base = fromCurrency;
  convertCurrency();
});

resultInput.addEventListener("input", () => {
  amount = parseFloat(resultInput.value.replace(",", "."));
  base = toCurrency;
  convertCurrency();
});

buttonCss(fromButtons, rub);
buttonCss(toButtons, usd);

fromButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    fromCurrency = btn.value;
    buttonCss(fromButtons, btn);
    base = fromCurrency;
    convertCurrency();
  });
});

toButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    toCurrency = btn.value;
    base = toCurrency;
    buttonCss(toButtons, btn);
    convertCurrency();
  });
});

function buttonCss(buttons, selectedButton) {
  buttons.forEach((btn) => btn.classList.remove("selected"));
  selectedButton.classList.add("selected");
}

async function convertCurrency() {
  const parsedAmount = parseFloat(amount);

  if (!parsedAmount || parsedAmount <= 0) {
    resultInput.value = "";
    error.textContent = "Please enter a valid amount.";
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/${ACCESS_KEY}/latest/${base}`);
    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();
    if (toCurrency === fromCurrency && response.ok) {
      resultInput.value = amount;
      fromSpan.textContent = `1 ${fromCurrency} = 1 ${toCurrency}`;
      toSpan.textContent = `1 ${toCurrency} = 1 ${fromCurrency}`;
      error.textContent = "";
      return;
    }
    const exchangeRate =
      base === fromCurrency
        ? data.conversion_rates[toCurrency]
        : 1 / data.conversion_rates[fromCurrency];

    if (!exchangeRate) {
      throw new Error(`Conversion rate not available.`);
    }

    const result =
      base === fromCurrency
        ? parsedAmount * exchangeRate
        : parsedAmount / exchangeRate;

    if (base === fromCurrency) {
      resultInput.value = result.toFixed(4);
    } else {
      amountInput.value = result.toFixed(4);
    }

    fromSpan.textContent = `1 ${fromCurrency} = ${exchangeRate.toFixed(
      4
    )} ${toCurrency}`;
    toSpan.textContent = `1 ${toCurrency} = ${(1 / exchangeRate).toFixed(
      4
    )} ${fromCurrency}`;
    error.textContent = "";
  } catch (err) {
    handleError();
  }
}
function handleError() {
  if (navigator.onLine) {
    console.error("Error fetching conversion data:", message);
    error.textContent = "Failed to fetch exchange rates. Try again later.";
    fromSpan.textContent = "Error fetching rate";
    toSpan.textContent = "Error fetching rate";
  } else {
    error.innerHTML = "Oooppss <br>You are offline. Check your connection.";
  }
}
window.addEventListener("online", () => {
  error.textContent = "";
  convertCurrency();
});
error.textContent = "";
convertCurrency();