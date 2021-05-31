let button      = document.querySelector('.header__button');
let header      = button.parentNode;
let mobileWidth = 600;

function openHeader(e) {
    if (window.innerWidth <= mobileWidth) {
        e.preventDefault();

        if ([].includes.call(header.classList, 'header_visible')) {
            header.classList.remove('header_visible');
            return null;
        }
        header.classList.add('header_visible');
    }
}

button.addEventListener('click', openHeader);
header.addEventListener('mouseleave', openHeader);