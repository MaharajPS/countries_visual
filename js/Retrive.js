let allCountries = [];
let filteredCountries = [];
let currentPage = 1;
const itemsPerPage = 16;

async function fetchData() {
  try {
    const response = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,flags,symbols,capital,borders,population,area,currencies'
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    allCountries = await response.json();
    filteredCountries = allCountries;
    displayPage(currentPage);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function displayPage(page) {
  const cardContainer = document.getElementById('card');

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const pageItems = filteredCountries.slice(startIndex, endIndex);

  cardContainer.innerHTML = pageItems.map(country => `
    <div class="country-card" onclick='openModal(${JSON.stringify(country)})'>
      <div class="img-box">
        <img src="${country.flags.png}" alt="${country.name.common}">
      </div>
      <h3>${country.name.common}</h3>
    </div>
  `).join('');


  renderPagination(page);
}

function renderPagination(page) {
  const nav = document.getElementById('pagination-nav');
  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);

  let html = '';

  html += `<button onclick="changePage(${page - 1})" ${page === 1 ? 'disabled' : ''}>&laquo;</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="${i === page ? 'active' : ''}" onclick="changePage(${i})">
        ${i}
      </button>
    `;
  }

  html += `<button onclick="changePage(${page + 1})" ${page === totalPages ? 'disabled' : ''}>&raquo;</button>`;

  nav.innerHTML = html;
}

function changePage(page) {
  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;

  currentPage = page;
  displayPage(currentPage);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


document.getElementById('searchInput').addEventListener('input', (e) => {
  const searchValue = e.target.value.toLowerCase();

  filteredCountries = allCountries.filter(country =>
    country.name.common.toLowerCase().includes(searchValue)
  );

  currentPage = 1;
  displayPage(currentPage);
});
const ACCU_API_KEY = "Your_api_key";

async function getLocationKeyByCity(city) {
  const url = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${ACCU_API_KEY}&q=${encodeURIComponent(city)}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data || data.length === 0) {
    throw new Error("City not found");
  }

  return data[0].Key;
}

async function getCurrentWeather(locationKey) {
  const url = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${ACCU_API_KEY}&details=true`;
  const res = await fetch(url);
  const data = await res.json();
  return data[0];
}


async function openModal(country) {
  let currencyText = "N/A";
  if (country.currencies) {
    const currencyObj = Object.values(country.currencies)[0];
    currencyText = `${currencyObj.name} (${currencyObj.symbol || ""})`;
  }

  const capitalCity = country.capital?.[0];

  
  document.getElementById("modalBody").innerHTML = `
    <h2>${country.name.official}</h2>
    <p><b>Capital:</b> ${capitalCity || "N/A"}</p>
    <p><b>Currency:</b> ${currencyText}</p>
    <p><b>Population:</b> ${country.population}</p>
    <p><b>Borders:</b> ${
      country.borders?.length ? country.borders.join(", ") : "None"
    }</p>

    <hr>
    <p id="weather"><b>Weather:</b> Loading...</p>
  `;

  document.getElementById("modal").style.display = "block";


  try {
    if (!capitalCity) throw new Error("No capital city");

    const locationKey = await getLocationKeyByCity(capitalCity);
    const weather = await getCurrentWeather(locationKey);
    document.getElementById("weather").style.display="none";
    document.getElementById("modalBody").innerHTML += `
      <div class="weather-box">
        <h3>&#x26C5; Current Weather (${capitalCity})</h3>
        <p><b>Condition:</b> ${weather.WeatherText}</p>
        <p><b>Temperature:</b> ${weather.Temperature.Metric.Value}°C</p>
        <p><b>Humidity:</b> ${weather.RelativeHumidity}%</p>
        <p><b>Wind:</b> ${weather.Wind.Speed.Metric.Value} km/h</p>
      </div>
    `;
  } catch (err) {
    document.getElementById("modalBody").innerHTML += `
      <p style="color:red;">Weather data unavailable</p>
    `;
    console.error(err);
  }
}



function closeModal() {
  document.getElementById("modal").style.display = "none";
}

window.onclick = function (event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    closeModal();
  }
};


fetchData();
