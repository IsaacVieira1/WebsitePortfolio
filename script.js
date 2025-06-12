document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slideshow img");
  let currentIndex = 0;

  function showSlide(index) {
    slides.forEach((img, i) => {
      img.classList.remove("active");
      if (i === index) {
        img.classList.add("active");
      }
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  showSlide(currentIndex);
  setInterval(nextSlide, 2000); 
});
