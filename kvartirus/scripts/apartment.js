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


/*function sortBenefits(listElem) {
    arr = [...listElem.children];
    arr.sort((elem1, elem2) => {
        if (elem1.clientHeight > elem2.clientHeight)      { return 1;  }
        else if (elem1.clientHeight < elem2.clientHeight) { return -1; }
        return 0;
    });
    arr.reverse();

    for (let i = 1; i <= arr.length; i++) {
        elem = arr[i-1];
        elem.style.order = i;
    }
}

sortBenefits(document.querySelector('.main__benefits-list'));*/

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
        810: 3,
        620: 2,
        420: 1
    }
});

window.onresize = masonry.recalculate.bind(masonry);