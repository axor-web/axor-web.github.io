const btn = document.querySelector('.header__menu-button');

function showMenu() {
    const menu = document.querySelector('.header__menu')
    const card = document.querySelector('.header__menu-card');

    if ([].includes.call(menu.classList, 'header__menu_active')) {
        menu.classList.remove('header__menu_active');
    }
    else {
        menu.classList.add('header__menu_active');
    }
}

btn.addEventListener('click', (e) => {
    e.preventDefault();
    showMenu();
})


const search = document.querySelector('.search')

search.onclick = () => {
    search.classList.add('search_active');
    search.onclick = null;
};

