let button = document.querySelector('.header__button');
let header = button.parentNode;

button.addEventListener('click', (e) => {
    e.preventDefault();
    
    if ([].includes.call(header.classList, 'header_visible')) {
        header.classList.remove('header_visible');
        return null;
    }
    header.classList.add('header_visible');
})