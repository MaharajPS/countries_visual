async function retrieveData() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Retrieved data:', data);
    const content = data.map(data=>`
        <div class="country-card">
        <div class="img-box">
          <img src="${data.flags.png}" alt="${data.name.common}">
        </div>
        <h3>${data.name.common}</h3>
      </div>
    `).join("");

    document.querySelector('#card').innerHTML = content;

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

retrieveData();

