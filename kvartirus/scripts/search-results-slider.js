const search = document.querySelector('.search')

function showSearch(e) {
    e.stopPropagation();
    search.classList.add('search_active');
}
function hideSearch() {
    search.classList.remove('search_active');
}
function checkClicks(e) {
    if (window.innerWidth <= 960) {
        window.addEventListener('click', () =>  {
            hideSearch();
        });
    }

    window.addEventListener('click', () => {
        activateMenu(null);
    });
}

search.onclick = showSearch;
checkClicks();
window.onresize = checkClicks;

const btns = document.querySelector('.main__specs-btns').children;
const menus = document.querySelector('.main__specs-menu').children;

function activateMenu(btn) {
    if (btn && [].includes.call(btn?.classList, 'active-btn')) {
        btn = null;
    }

    for (let btn of btns)   { btn.classList.remove('active-btn');   }
    for (let menu of menus) { menu.classList.remove('menu_active'); }

    let menu;
    switch (btn?.id) {
        case 'main__specs-btns-map':
            menu = document.querySelector('.main__specs-menu-map');
            break;

        case 'main__specs-btns-filter':
            menu = document.querySelector('.main__specs-menu-filter');
            break;

        case 'main__specs-btns-sort':
            menu = document.querySelector('.main__specs-menu-sort');
            break;
    }

    btn?.classList.add('active-btn');
    menu?.classList.add('menu_active');

    const list = document.querySelector('.main__list');

    if (btn) {
        list.style.marginTop = `${menu.clientHeight + 40}px`;
    }
    else {
        list.style.marginTop = '0px';
    }
}

for (let btn of btns) {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        activateMenu(btn);
        hideSearch();
    });
}

document.querySelector('.main__specs-menu').onclick = (e) => {
    e.stopPropagation();
    hideSearch();
}

document.querySelector('#main__specs-btns-map').onclick = () => {
    document.querySelector('.main__specs-menu-map iframe').src = "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15051.073200557083!2d37.58078374853958!3d55.728877795253304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2sru!4v1640435531733!5m2!1sru!2sru";
    
    document.querySelector('#main__specs-btns-map').onclick = null;
}

function countSomething(input, controls) {
    controls = controls.children;

    function checkValue() {
        if (+input.value < +input.min) {
            input.value = +input.min;
        }
        if (+input.value > +input.max) {
            input.value = +input.max;
        }
    }

    controls[0].onclick = () => {
        input.value = +input.value - 1;
        checkValue();
    }
    controls[1].onclick = () => {
        input.value = +input.value + 1;
        checkValue();
    }
}

const rooms = document.querySelector('#rooms');
const roomsControls = document.querySelector('#rooms ~ .controls');
countSomething(rooms, roomsControls);

const rating = document.querySelector('#rating');
const ratingControls = document.querySelector('#rating ~ .controls');
countSomething(rating, ratingControls);

const bedsNum = document.querySelector('#beds-num');
const bedsNumControls = document.querySelector('#beds-num ~ .controls');
countSomething(bedsNum, bedsNumControls);

let sliders = document.querySelectorAll('.slider');

let imgs = [
    ['apartment1', 'apartment2', 'apartment3', 'apartment4', 'apartment5'],
    ['apartment4', 'apartment3', 'apartment2', 'apartment1'],
    ['apartment2', 'apartment3', 'apartment4'],
];
let slidersObjects = [];

for (let i = 0; i < sliders.length; i++) { 
    let slider = sliders[i];
    slidersObjects.push(new Slider(slider, imgs[i]));
}