const currencyOne = document.getElementById('currency-one');
const currencyTwo = document.getElementById('currency-two');
const amountOne = document.getElementById('amount-one');
const amountTwo = document.getElementById('amount-two');
const rateElement = document.getElementById('rate');
const swap = document.getElementById('swap');

async function loadCurrencies() {
  const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  const data = await res.json();

  const currencies = Object.keys(data.rates);
  console.log(currencies);
  console.log(currencyOne);
  console.log(currencyTwo);
  currencyOne.innerHTML = '';
  currencyTwo.innerHTML = '';

  currencies.forEach((curr) => {
    const option1 = document.createElement('option');
    const option2 = document.createElement('option');

    option1.value = option2.value = curr;
    option1.textContent = option2.textContent = curr;

    currencyOne.appendChild(option1);
    currencyTwo.appendChild(option2);
  });

  // default selected
  currencyOne.value = 'USD';
  currencyTwo.value = 'PKR';
}

function calculate() {
  const currency_one = currencyOne.value;
  const currency_two = currencyTwo.value;
  console.log(currency_one, currency_two);

  fetch(`https://api.exchangerate-api.com/v4/latest/${currency_one}`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      const rate = data.rates[currency_two];

      rateElement.innerText = `1 ${currency_one} = ${rate} ${currency_two}`;

      amountTwo.value = (amountOne.value * rate).toFixed(2);
    });
}
swap.addEventListener('click', () => {
  const temp = currencyOne.value;
  currencyOne.value = currencyTwo.value;
  currencyTwo.value = temp;
  calculate();
});

function init() {
  loadCurrencies();
  calculate();
}

currencyOne.addEventListener('change', calculate);
currencyTwo.addEventListener('change', calculate);
amountOne.addEventListener('input', calculate);
amountTwo.addEventListener('input', calculate);
window.addEventListener('DOMContentLoaded', init);
