const searchForm = document.getElementById('searchForm');
const searchIcon = document.getElementById('searchIcon');

searchForm.addEventListener('submit', performSearch);
searchIcon.addEventListener('click', performSearch);

function performSearch(event) {
    event.preventDefault();

    const searchInput = document.getElementById('searchProducts');
    const query = searchInput.value;

    const url = `/items?search=${query}`;
    window.location.href = url;
}