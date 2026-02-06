function imageLoaded() {
  const loader = document.getElementById("loader");
  const img = document.getElementById("mainImage");

  loader.style.display = "none";
  img.style.display = "block";
}
