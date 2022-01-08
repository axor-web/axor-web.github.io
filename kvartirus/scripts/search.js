const cityInput = document.querySelector('.search__city input')

let citiesList = document.querySelectorAll('.search__city-list > div');

cityInput.onchange = updateList;
cityInput.onfocus = function(e) { this.classList.add('search__city_active'); };
cityInput.onblur = function(e) { setTimeout(() => this.classList.remove('search__city_active'), 100); };

function updateList() {
    citiesList = document.querySelectorAll('.search__city-list > div');
    for (let city of citiesList) {
        city.onclick = (e) => {
            cityInput.value = city.innerText.slice(0, city.innerText.indexOf(','));
        }
    }
}

updateList();

const hideBtn = document.querySelector('.search__hide-btn');

hideBtn.onclick = (e) => {
    e.stopPropagation();
    document.querySelector('.search').classList.remove('search_active');
};