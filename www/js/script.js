let searchButton = document.querySelector('.header__buttons-search img');
let searchInput = document.querySelector('.header__buttons-search input[type="text"]');
let searchParent = searchInput.parentNode;
let hiddenClass= 'header__buttons-search_hidden';

function search(value) {
    if (value) {
        window.open(`https://www.google.com/search?q=${value}`, '_blank');
        searchInput.value = '';
        searchInput.blur();
        searchParent.classList.add(hiddenClass);
    }
}

searchButton.addEventListener('click', () => {
    if ([].includes.call(searchParent.classList, hiddenClass)) {
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