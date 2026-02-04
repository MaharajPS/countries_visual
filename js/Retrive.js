let allCountries = [];
let filteredCountries = [];
let currentPage = 1;
const itemsPerPage = 16;

async function fetchData() {
  try {
    const response = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,flags'
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
    <div class="country-card">
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

fetchData();
