module.exports = {
  darkMode: 'media',
  // ...
}

document.querySelector(".menu-toggle").addEventListener("click", function () {
  document.querySelector(".nav-links").classList.toggle("show");
});
