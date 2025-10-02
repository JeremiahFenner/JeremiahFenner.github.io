








const myButton = document.getElementById('headelement');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScrollTop > lastScrollTop) {
    // Scrolling down
    myButton.classList.add('opaque-button');
  } else {
    // Scrolling up
    myButton.classList.remove('opaque-button');
  }

  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
});