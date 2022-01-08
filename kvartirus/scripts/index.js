const search = document.querySelector('.search')

search.onclick = () => {
    search.classList.add('search_active');
    search.onclick = null;
};

