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

const slider = new Slider(document.querySelector('.slider'), 
[
    'apartment1',
    'apartment2',
    'apartment3',
    'apartment4',
    'apartment5',
]);


window.onscroll = () => {
    document.querySelector('.main__map iframe').src = "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15051.073200557083!2d37.58078374853958!3d55.728877795253304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2sru!4v1640435531733!5m2!1sru!2sru";
    window.onscroll = null;
}

const list = document.querySelector('.main__benefits-list');

const masonry = Macy({
    container: list,
    margin: {
        x: 8,
        y: 8
    },
    columns: list.children.length,
    breakAt: {
        1210: 5,
        1015: 4,
        705: 3,
        540: 2,
        365: 1
    }
});

window.onresize = masonry.recalculate.bind(masonry);

const mobileShowBtns = document.querySelectorAll('.main__mobile-show-btn');
const mobileHiddenElems = document.querySelectorAll('.main__mobile_hiding');

for (let i = 0; i < mobileShowBtns.length; i++) {
    const btn = mobileShowBtns[i]
    btn.addEventListener('click', mobileShowBtnHandler.bind(btn, mobileHiddenElems[i]));
}

function mobileShowBtnHandler(elems) {
    if ([].includes.call(elems.classList, 'main__mobile_active')) {
        this.classList.remove('main__mobile-show-btn_active');
        elems.classList.remove('main__mobile_active');
        return;
    }

    this.classList.add('main__mobile-show-btn_active');
    elems.classList.add('main__mobile_active');
}