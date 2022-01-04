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


let contBtns = document.querySelectorAll('.main__forms-btns-forward');
let backBtns = document.querySelectorAll('.main__forms-btns-back');
let forms = document.querySelector('.main__forms').children;
let indexOfForm = 0;

const progressBarNums = document.querySelectorAll('.main__progress-bar-num');
const progressBarElems = document.querySelector('.main__progress-bar-elems');

for (let btn of contBtns) {
    btn.onclick = slideFormHandler.bind(btn, 1);
}
for (let btn of backBtns) {
    btn.onclick = slideFormHandler.bind(btn, -1);
}

function slideFormHandler(step) {
    if (indexOfForm + step < 0 || indexOfForm + step > 2) { return; }

    indexOfForm += step;
    changeActiveForm(indexOfForm);
}

function changeActiveForm(index) {
    if (index < 0 || index > 2) { return; }

    removeActiveFormClasses();

    forms[index].classList.add('main__forms_active');

    for (let num = 0; num <= index; num++) {
        progressBarNums[num].classList.add('main__progress-bar-num_active');
    }

    progressBarElems.classList.add(`main__progress-bar-elems_${index+1}-active`);
}

function removeActiveFormClasses() {
    for (let form of forms) {
        form.classList.remove('main__forms_active');
    }
    for (let num of progressBarNums) {
        num.classList.remove('main__progress-bar-num_active');
    }
    for (let i = 0; i < 3; i++) {
        progressBarElems.classList.remove(`main__progress-bar-elems_${i+1}-active`);
    }
}


window.onclick = () => {
    document.querySelector('.main__forms-check-map-iframe iframe').src = "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15051.073200557083!2d37.58078374853958!3d55.728877795253304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2sru!4v1640435531733!5m2!1sru!2sru";
    window.onclick = null;
}