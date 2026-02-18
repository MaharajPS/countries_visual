const title = document.querySelector(".card__title");
const description = document.querySelector(".card__description");

title.classList.remove("loading");
description.classList.remove("loading");
image.classList.remove("loading");

const btn = document.getElementById('jokeBtn');
const text = document.getElementById('jokeText');



btn.addEventListener('click', async () => {
    const res = await fetch('https://icanhazdadjoke.com/', {
        headers: { 'Accept': 'application/json' }
    });
    const data = await res.json();
    text.innerText = data.joke;
});