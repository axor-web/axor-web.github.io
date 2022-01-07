const cityInput = document.querySelector('.search__city input')

let citiesList = document.querySelectorAll('.search__city-list div');

cityInput.onchange = updateList;

function updateList() {
    citiesList = document.querySelectorAll('.search__city-list div');
    for (let city of citiesList) {
        city.onclick = () => {
            cityInput.value = city.innerText.slice(0, city.innerText.indexOf(','));
        }
    }
}

updateList();