function openMenu() {
    let header = document.querySelector('.header');
    if (!header.classList[1]) { header.classList.add('header_opened') }
    else { header.classList.remove('header_opened') }
}


function back() {
    let active = document.querySelector('.main__testimonials-card_active');
    let cards = active.parentNode.children;
    let index = [...cards].findIndex(item => (item == active) ? true : false);

    if (document.documentElement.clientWidth <= 1100 && index == 0) {
        index = 3;
    } else if (cards[0] == active) {
        return null;
    }

    active.classList.remove('main__testimonials-card_active');
    cards[index - 1].classList.add('main__testimonials-card_active');
    translate(index - 1);    
}

function forward() {
    let active = document.querySelector('.main__testimonials-card_active');
    let cards = active.parentNode.children;
    let index = [...cards].findIndex(item => (item == active) ? true : false);
    if (document.documentElement.clientWidth <= 1100 && index == 2) {
        index = -1;
    } else if (cards[2] == active) {
        return null;
    }

    active.classList.remove('main__testimonials-card_active');
    cards[index + 1].classList.add('main__testimonials-card_active');
    translate(index + 1);  
}

function translate(index) {
    let cards = document.querySelector('.main__testimonials-cards');
    switch (index) {
        case 0:
            cards.style.left = '0';
            break;
        case 1:
            cards.style.left = '-300px';
            break;
        case 2:
            cards.style.left = '-600px';
    }
}