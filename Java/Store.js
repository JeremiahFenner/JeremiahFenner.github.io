







//////////////////////// Fade header elements when scrolling down

const myButtons = document.querySelectorAll('#headelement');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScrollTop > lastScrollTop) {
    // Scrolling down - apply to all buttons
    myButtons.forEach(button => {
      button.classList.add('opaque-button');
    });
  } else {
    // Scrolling up - remove from all buttons
    myButtons.forEach(button => {
      button.classList.remove('opaque-button');
    });
  }

  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
});