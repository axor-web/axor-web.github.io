"use strict"

// Скрипт для поиска

let searchButton = document.querySelector('.header__buttons-search img');
let searchInput = document.querySelector('.header__buttons-search input[type="text"]');
let searchParent = searchInput.parentNode;
const hiddenClass= 'header__buttons-search_hidden';

function search(value) {
    if (value) {
        window.open(`https://www.google.com/search?q=${value}`, '_blank');
        searchInput.value = '';
        searchInput.blur();
        searchParent.classList.add(hiddenClass);
    }
}

searchButton.addEventListener('click', () => {
    if ([].includes.call(searchParent.classList, hiddenClass)) { // заимствуем у массива метод includes для classList
        searchParent.classList.remove(hiddenClass);
        searchButton.blur();
        searchInput.focus();
        searchInput.classList.add('focused');
    }
    else search(searchInput.value);
});

searchInput.addEventListener('blur', () => {
    if (![].includes.call(searchParent.classList, hiddenClass) && !searchInput.value) {
        searchParent.classList.add(hiddenClass);
        searchInput.classList.remove('focused');
    }
});
searchInput.addEventListener('keyup', event => {
    if (event.code == 'Enter') {
        search(searchInput.value);
    }
});




// Скрипт для мобильного меню

let mobileButton = document.querySelector('.header__mobile-button');

mobileButton.addEventListener('click', () => {
    let header = document.querySelector('.header');
    
    if (![].includes.call(header.classList, 'header_hidden')) {
        header.classList.add('header_hidden');
        document.body.style.overflowY = '';
    } 
    else {
        header.classList.remove('header_hidden');
        document.body.style.overflowY = 'hidden';
    }
});



// Скрипт для параллакса по движению мыши

/*document.addEventListener('mousemove', parallax);

function parallax(e) {
    const mobileWidth = 1270;
    if (window.innerWidth > mobileWidth) {
        document.querySelectorAll('.main__hero-layer').forEach(layer => {
            const speed = layer.getAttribute('data-speed');
    
            const x = (window.innerHeight - e.pageX * speed)/100;
            const y = (window.innerWidth - e.pageY * speed)/100;
            
            layer.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    }
}*/

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

makeParallax(document.querySelectorAll('.main__hero-layer'         ), 1100)
makeParallax(document.querySelectorAll('.main__documentation-layer'), 1100)
makeParallax(document.querySelectorAll('.main__testimonials-layer' ), 1100)


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
    `;

    let arrows = document.querySelectorAll(block + '-arrows a');

    let num = 0;
    function leafCard(count) {
        //чекаем допустим ли num и меняем состояние стрелочек
        num += count;

        if (num < 0)     { num = 0; return false }
        if (num == last + 1) { num = last; return false }

        // меняем вид стрелочек
        arrows[0].classList.remove('arrow_inactive');
        arrows[1].classList.remove('arrow_inactive');
        if (num == 0)        { arrows[0].classList.add('arrow_inactive'); }
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