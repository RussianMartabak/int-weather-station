import lookup from "country-code-lookup";
const textInput = document.querySelector(".text-input");
const searchButton = document.querySelector(".search-button");
const isFahrenheit = document.querySelector("#fahrenheit");

searchButton.addEventListener("click", inputHandler);

async function inputHandler(e) {
  if (textInput.value === "") {
    alert("You can't search for nothing!");
  } else {
    //if valid
    let city = textInput.value;
    //get json if succeed, if 404 return nothing
    let weatherData = await getWeather(city, isFahrenheit.checked);
    if (weatherData) {
      displayWeather(
        weatherData.name,
        weatherData.sys.country,
        weatherData.main.temp,
        weatherData.weather[0].main,
        isFahrenheit.checked
      );
    } else {
      displayError();
    }
    textInput.value = "";
    console.log(weatherData);
  }
}

function fromISOtoName(countryCode) {
  let countryData = lookup.byIso(countryCode);
  return countryData.country;
}

async function getWeather(cityname, inImperial) {
  let unit;
  inImperial ? (unit = "imperial") : (unit = "metric");
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=57006b9e3fd14d8514452924a04f7bcb&units=${unit}`,
    { mode: "cors" }
  );
  let data = await response.json();
  //vanilla fetch seems to not make error, they just return response no matter what
  if (response.ok) {
    return data;
  } else {
    return;
  }
}

function displayError() {
  let displayBox = document.querySelector(".display-box");
  if (displayBox) displayBox.remove();

  const box = createBox();
  box.textContent = "Oops, the city is not found";
  document.body.appendChild(box);
}

function displayWeather(cityname, countryCode, temp, weather, inImperial) {
  let displayBox = document.querySelector(".display-box");
  if (displayBox) displayBox.remove();
  //make a box based on the infos
  const box = createBox();
  let title = document.createElement("div");
  title.classList.add("medium-text");
  title.textContent = cityname;
  box.appendChild(title);

  let country = document.createElement("div");
  country.classList.add("country-text");
  country.textContent = fromISOtoName(countryCode);
  box.appendChild(country);

  //if in imperial, display unit as F else as C
  let tempunit;
  inImperial ? (tempunit = "&#8457;") : (tempunit = "&#8451;");

  let tempDisplay = document.createElement("div");
  tempDisplay.classList.add("main-text");
  tempDisplay.innerHTML = temp + tempunit;
  box.appendChild(tempDisplay);

  let weatherDisplay = document.createElement('div');
  weatherDisplay.classList.add('main-text');
  weatherDisplay.textContent = weather;
  box.appendChild(weatherDisplay);

  document.body.appendChild(box);
}

//make some function that create the grey box
function createBox() {
  const element = document.createElement("div");
  element.classList.add("display-box");
  return element;
}
//take the grey box either to show error message or display weather data
