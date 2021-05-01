"use strict"

// Скрипт для поиска

let searchButton = document.querySelector('.header__buttons-search img');
let searchInput = document.querySelector('.header__buttons-search input[type="text"]');
let searchParent = searchInput.parentNode;
const visibleClass= 'header__buttons-search_visible';

function search(value) {
    if (value) {
        window.open(`https://www.google.com/search?q=${value}`, '_blank');
        searchInput.value = '';
        searchInput.blur();
        searchParent.classList.remove(visibleClass);
    }
}

searchButton.addEventListener('click', () => {
    if (![].includes.call(searchParent.classList, visibleClass)) { // заимствуем у массива метод includes для classList
        searchParent.classList.add(visibleClass);
        searchButton.blur();
        searchInput.focus();
        searchInput.classList.add('focused');
    }
    else if (searchInput.value) { search(searchInput.value); }
});

searchInput.addEventListener('blur', () => {
    if ([].includes.call(searchParent.classList, visibleClass) && !searchInput.value) {
        console.log('wow!');
        searchParent.classList.remove(visibleClass);
        searchInput.classList.remove('focused');
    }
});
searchInput.addEventListener('keyup', event => {
    if (event.code == 'Enter' && searchInput.value) {
        search(searchInput.value);
    }
});




// Скрипт для мобильного меню

let mobileButton = document.querySelector('.header__mobile-button');

mobileButton.addEventListener('click', () => {
    let header = document.querySelector('.header');
    
    if (![].includes.call(header.classList, 'header_visible')) {
        header.classList.add('header_visible');
        document.body.style.overflowY = 'hidden';
    } 
    else {
        header.classList.remove('header_visible');
        document.body.style.overflowY = '';
    }
});



// Скрипт для параллакса по движению мыши

function makeParallax(layers, mobileWidth) {
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth > mobileWidth) {
            layers.forEach(layer => {
                const speed = layer.getAttribute('data-speed');
        
                const x = (window.innerHeight - e.pageX * speed)/100;
                const y = (window.innerWidth - e.pageY * speed)/100;
                
                layer.style.transform = `translateX(${x}px) translateY(${y}px)`;
            });
        }
    });
}

makeParallax(document.querySelectorAll('.main__hero-layer'         ), 1050);
makeParallax(document.querySelectorAll('.main__documentation-layer'), 1050);
makeParallax(document.querySelectorAll('.main__testimonials-layer' ), 1050);
makeParallax(document.querySelectorAll('.footer__people-layer'     ), 1050);


function makeSlider(block, perspective, depth) {
    let style = document.querySelector('style');
    let cards = document.querySelectorAll(block + '-card');
    let last = cards.length - 1;

    cards[0].parentNode.style.perspective = perspective;

    for (let i = 0; i <= last; i++) {
        style.textContent += `
            .main__testimonials-info-card[data-pos="${i}"] {
                z-index: ${100 - i};
                transform: translateZ(-${i * depth}vw);
            }
        `;
    }

    //делаем анимацию
    style.textContent += `
        @keyframes leaf-card {
            from {
                z-index: ${100 - last};
                transform: translateZ(-${last * depth}vw);
            }
            
            50% {
                z-index: 100;
                transform: translateZ(-${last/2 * depth}vw) translateY(-150%);
            }
            
            to {
                z-index: 100;
                transform: translateZ(0) translateY(0);
            }
        }

        .leaf {
            animation: leaf-card .3s ease-in 1 normal;
        }
        .leaf-back {
            animation: leaf-card .3s ease-in 1 reverse;
        }

        ${block}-card {
            transition: transform .3s, z-index .3s;
        }
        ${block}-card.leaf, ${block}-card.leaf-back  {
            transition: none;
        }
    `;

    let arrows = document.querySelectorAll(block + '-arrows a');

    let num = 0;
    function leafCard(count) {
        //count = -1 или 1, т.е. листать назад или вперед
        //чекаем допустим ли num и меняем состояние стрелочек
        num += count;

        if (num < 0)         { num = 0;    return false }
        if (num == last + 1) { num = last; return false }

        // меняем вид стрелочек
        arrows[0].classList.remove('arrow_inactive');
        arrows[1].classList.remove('arrow_inactive');
        if (num == 0)    { arrows[0].classList.add('arrow_inactive'); }
        if (num == last) { arrows[1].classList.add('arrow_inactive'); }

        //меняем позиции элементов
        if (count + 1) {
            for (let card of cards) {
                let pos = +card.getAttribute('data-pos');

                if (pos == last) {
                    card.setAttribute('data-pos', '0');
                    card.classList.add('leaf');
                    setTimeout(() => card.classList.remove('leaf'), 300);
                }

                else { card.setAttribute('data-pos', `${++pos}`); }
            }
        }

        else {
            for (let card of cards) {
                let pos = +card.getAttribute('data-pos');

                if (pos == 0) {
                    card.setAttribute('data-pos', `${last}`);
                    card.classList.add('leaf-back');
                    setTimeout(() => card.classList.remove('leaf-back'), 300);
                }

                else { card.setAttribute('data-pos', `${--pos}`); }
            }
        }
    }

    //back
    arrows[0].addEventListener('click', leafCard.bind(null, -1));
    //forward
    arrows[1].addEventListener('click', leafCard.bind(null, 1));
}

makeSlider('.main__testimonials-info', '15vw', 1.3);


//переход между блоками по скроллу

/*let sections = document.querySelectorAll('.section');
let numOfSec = 0;

document.addEventListener('scroll', e => {
    let distance = document.documentElement.scrollTop + document.documentElement.clientHeight;
    let current = sections[numOfSec];


    if (distance > current.offsetTop + current.offsetHeight) {
        numOfSec++;
        current = sections[numOfSec];
        document.documentElement.scrollTop = current.offsetTop - 100;
    }
});*/