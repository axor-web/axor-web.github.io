const btn = document.querySelector('.header__menu-button');
const menu = document.querySelector('.header__menu')
const card = document.querySelector('.header__menu-card');

function showMenu() {
    if ([].includes.call(menu.classList, 'header__menu_active')) {
        menu.classList.remove('header__menu_active');
    }
    else {
        menu.classList.add('header__menu_active');
    }

    updateCardWidth();
}

function updateCardWidth() {
    card.style.width = btn.getBoundingClientRect().left + 52 + 'px';
}

btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    showMenu();
});
card.addEventListener('click', (e) => e.stopPropagation());

window.addEventListener('resize', updateCardWidth);
window.addEventListener('click', () => {
    if ([].includes.call(menu.classList, 'header__menu_active')) {
        menu.classList.remove('header__menu_active');
    }
});

let headerLists = document.querySelectorAll('.header li ul');

for (let list of headerLists) {
    list.parentNode.addEventListener('click', () => list.style.maxHeight = '1000px');
}