import lookup from 'country-code-lookup';

const textInput = document.querySelector('.text-input');
const searchButton = document.querySelector('.search-button');
const isFahrenheit = document.querySelector('#fahrenheit');

searchButton.addEventListener('click', inputHandler);
window.addEventListener('keydown', keydownHandler);

async function inputHandler() {
  if (textInput.value === '') {
    alert("You can't search for nothing!");
  } else {
    // if valid
    const city = textInput.value;
    // get json if succeed, if 404 return nothing
    const weatherData = await getWeather(city, isFahrenheit.checked);
    if (weatherData) {
      displayWeather(
        weatherData.name,
        weatherData.sys.country,
        weatherData.main.temp,
        weatherData.weather[0].main,
        isFahrenheit.checked,
      );
    } else {
      displayError();
    }
    textInput.value = '';
    console.log(weatherData);
  }
}

async function keydownHandler(e) {
  if (e.code === 'Enter') {
    if (textInput.value === '') {
      alert("You can't search for nothing!");
    } else {
      // if valid
      const city = textInput.value;
      // get json if succeed, if 404 return nothing
      const weatherData = await getWeather(city, isFahrenheit.checked);
      if (weatherData) {
        displayWeather(
          weatherData.name,
          weatherData.sys.country,
          weatherData.main.temp,
          weatherData.weather[0].main,
          isFahrenheit.checked,
        );
      } else {
        displayError();
      }
      textInput.value = '';
      console.log(weatherData);
    }
  }
}

function fromISOtoName(countryCode) {
  const countryData = lookup.byIso(countryCode);
  return countryData.country;
}

async function getWeather(cityname, inImperial) {
  const unit = inImperial ? 'imperial' : 'metric';
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=57006b9e3fd14d8514452924a04f7bcb&units=${unit}`,
      { mode: 'cors' },
    );
    const data = await response.json();
    // vanilla fetch seems to not make error, they just return response no matter what
    if (response.ok) {
      return data;
    }
    return undefined;
  } catch (err) {
    alert(err);
    return undefined;
  }
}

function displayError() {
  const displayBox = document.querySelector('.display-box');
  if (displayBox) displayBox.remove();

  const box = createBox();
  box.textContent = 'Oops, the city is not found';
  document.body.appendChild(box);
}

function displayWeather(cityname, countryCode, temp, weather, inImperial) {
  const displayBox = document.querySelector('.display-box');
  if (displayBox) displayBox.remove();
  // make a box based on the infos
  const box = createBox();
  const title = document.createElement('div');
  title.classList.add('medium-text');
  title.textContent = cityname;
  box.appendChild(title);

  const country = document.createElement('div');
  country.classList.add('country-text');
  country.textContent = fromISOtoName(countryCode);
  box.appendChild(country);

  // if in imperial, display unit as F else as C

  const tempunit = inImperial ? '&#8457;' : '&#8451;';

  const tempDisplay = document.createElement('div');
  tempDisplay.classList.add('main-text');
  tempDisplay.innerHTML = temp + tempunit;
  box.appendChild(tempDisplay);

  const weatherDisplay = document.createElement('div');
  weatherDisplay.classList.add('main-text');
  weatherDisplay.textContent = weather;
  box.appendChild(weatherDisplay);

  document.body.appendChild(box);
}

// make some function that create the grey box
function createBox() {
  const element = document.createElement('div');
  element.classList.add('display-box');
  return element;
}
// take the grey box either to show error message or display weather data
