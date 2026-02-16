
const API_KEY = '6b54c855';
const BASE_URL = 'https://www.omdbapi.com/';


const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const moviesGrid = document.getElementById('moviesGrid');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');


document.addEventListener('DOMContentLoaded', () => {
    searchMovies('marvel');
});


searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchMovies(query);
    } else {
        alert('Please enter a movie name');
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            searchMovies(query);
        }
    }
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
});


modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});


async function searchMovies(query) {
    try {
        
        loading.classList.remove('hidden');
        error.classList.add('hidden');
        moviesGrid.innerHTML = '';

        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`);
        const data = await response.json();

        loading.classList.add('hidden');

        if (data.Response === 'True') {
            displayMovies(data.Search);
        } else {
            showError(data.Error || 'No movies found');
        }
    } catch (err) {
        loading.classList.add('hidden');
        showError('Failed to fetch movies. Please check your internet connection.');
        console.error('Error:', err);
    }
}


function displayMovies(movies) {
    moviesGrid.innerHTML = movies.map(movie => `
        <div class="movie-card" onclick="getMovieDetails('${movie.imdbID}')">
            <img 
                src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}" 
                alt="${movie.Title}"
                class="movie-poster"
                onerror="this.src='https://via.placeholder.com/300x450?text=No+Poster'"
            >
            <div class="p-4">
                <h3 class="font-bold text-lg mb-2">${movie.Title}</h3>
                <p class="text-gray-400">Year: ${movie.Year}</p>
                <p class="text-gray-400">Type: ${movie.Type}</p>
            </div>
        </div>
    `).join('');
}


async function getMovieDetails(imdbID) {
    try {
        modalContent.innerHTML = '<div class="text-center py-8">Loading...</div>';
        modal.classList.add('active');

        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`);
        const movie = await response.json();

        if (movie.Response === 'True') {
            displayMovieDetails(movie);
        } else {
            modalContent.innerHTML = '<p class="text-red-500">Failed to load movie details</p>';
        }
    } catch (err) {
        modalContent.innerHTML = '<p class="text-red-500">Error loading movie details</p>';
        console.error('Error:', err);
    }
}


function displayMovieDetails(movie) {
    modalContent.innerHTML = `
        <div class="flex flex-col md:flex-row gap-6">
            <div class="md:w-1/3">
                <img 
                    src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}" 
                    alt="${movie.Title}"
                    class="w-full rounded-lg shadow-lg"
                    onerror="this.src='https://via.placeholder.com/300x450?text=No+Poster'"
                >
            </div>
            <div class="md:w-2/3">
                <h2 class="text-2xl font-bold text-movie-accent mb-4">${movie.Title}</h2>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p class="text-gray-400">Year</p>
                        <p class="font-semibold">${movie.Year}</p>
                    </div>
                    <div>
                        <p class="text-gray-400">Rated</p>
                        <p class="font-semibold">${movie.Rated}</p>
                    </div>
                    <div>
                        <p class="text-gray-400">Runtime</p>
                        <p class="font-semibold">${movie.Runtime}</p>
                    </div>
                    <div>
                        <p class="text-gray-400">IMDB Rating</p>
                        <p class="font-semibold">${movie.imdbRating} ⭐</p>
                    </div>
                </div>

                <div class="mb-4">
                    <p class="text-gray-400 mb-1">Genre</p>
                    <p class="font-semibold">${movie.Genre}</p>
                </div>

                <div class="mb-4">
                    <p class="text-gray-400 mb-1">Director</p>
                    <p class="font-semibold">${movie.Director}</p>
                </div>

                <div class="mb-4">
                    <p class="text-gray-400 mb-1">Cast</p>
                    <p class="font-semibold">${movie.Actors}</p>
                </div>

                <div class="mb-4">
                    <p class="text-gray-400 mb-1">Plot</p>
                    <p class="text-gray-300">${movie.Plot}</p>
                </div>
            </div>
        </div>
    `;
}


function showError(message) {
    error.querySelector('p').textContent = `❌ ${message}`;
    error.classList.remove('hidden');
}


window.getMovieDetails = getMovieDetails;