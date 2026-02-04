let allCountries = [];
let currentPage = 1;
const itemsPerPage = 16;

async function fetchData() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    allCountries = await response.json();
    displayPage(currentPage);
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayPage(page) {
  const container = document.querySelector('.card');
  const navContainer = document.getElementById('pagination-nav');

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = allCountries.slice(startIndex, endIndex);

  container.innerHTML = paginatedItems.map(country => `
    <div class="country-card">
      <div class="img-box">
        <img src="${country.flags.png}" alt="${country.name.common}">
      </div>
      <h3>${country.name.common}</h3>
    </div>
  `).join("");

  renderPagination(page);
}

function renderPagination(page) {
  const navContainer = document.getElementById('pagination-nav');
  const totalPages = Math.ceil(allCountries.length / itemsPerPage);
  
  let paginationHTML = '';

  paginationHTML += `<button onclick="changePage(${page - 1})" ${page === 1 ? 'disabled' : ''}>&laquo;</button>`;

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
      <button class="${i === page ? 'active' : ''}" onclick="changePage(${i})">
        ${i}
      </button>
    `;
  }

  paginationHTML += `<button onclick="changePage(${page + 1})" ${page === totalPages ? 'disabled' : ''}>&raquo;</button>`;

  navContainer.innerHTML = paginationHTML;
}

function changePage(newPage) {
  const totalPages = Math.ceil(allCountries.length / itemsPerPage);
  if (newPage < 1 || newPage > totalPages) return;

  currentPage = newPage;
  displayPage(currentPage);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

fetchData();