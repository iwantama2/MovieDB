const apiKey = "32155a788ef6f8a0f31ec66295fec72f";
const imgApi = "https://image.tmdb.org/t/p/w1280";
const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`
const form = document.getElementById("search-form");
const query = document.getElementById("search-input");
const result = document.getElementById("result");

let page = 1;
let isSearching = false;

//Fetch data from url

async function fetchData(url){
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error("Network response was not ok.");
        }
        return await response.json();
    } catch(error) {
        return null
    }
}

//Fetch and show results based on url
async function fetchAndShowResult(url){
    const data = await fetchData(url);
    if(data && data.results) {
        showResults(data.results);
    }
}


//Create movie card html template
function createMovieCard(movie){
    const { poster_path, original_title, release_date, overview } = movie;
    const imagePath = poster_path ? imgApi + poster_path : "./img-01.jpeg";
    const trucatedTitle = original_title.length > 15 ? original_title.slice(0, 15) + "..." : original_title;
    const formattedDate = release_date || "No release date";
    const cardTemplate = `
        <div class"column">
            <div class="card">
                <a class="card-media" href="./img-01.jpeg">
                    <img src="${imagePath}" alt="${original_title}" width="100%" />
                </a>
            <div class="card-content">
            <div class="card-header">
                <div class="left-content">
                    <h3 style="font-weight: 600">${trucatedTitle}</h3>
                    <span style="color: #12efec">${formattedDate}</span>
                </div>
            <div class="right-content">
                <a class="card-btn" href="${imagePath}" target="_blank">Lihat Cover</a>
            </div>
            </div>
            <div class="info">
                ${overview || "No Overview!"}
                </div>
                </div>
            </div>
        </div>
    `;
    return cardTemplate;
}

// Clear result element
function clearResults() {
    result.innerHTML = "";
}

// Show results in page
function showResults(item) {
    const newContent = item.map(createMovieCard).join("");
    result.innerHTML += newContent || "<p>Tidak Ada Film Yang Ditampilkan.</p>";
}

// Load More results Movie
async function loadMoreResults() {
    if(isSearching) {
        return;
    }
    page++;
    const searchTerm = query.value;
    const url = searchTerm ? `${searchUrl}${searchTerm}&page=${page}` : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    await fetchAndShowResult(url);
}

//Detect end of page and load more results
function detectEnd() {
    const { scrollTop, clientHeight, scrollHeight} = document.documentElement;
    if(scrollTop + clientHeight >= scrollHeight - 20){
        loadMoreResults();
    }
}


// Handle Search
async function handleSearch(e){
    e.preventDefault();
    const searchTerm = query.value.trim();
    if(searchTerm) {
        isSearching = true;
        clearResults();
        const newUrl = `${searchUrl}${searchTerm}&page=${page}`;
        await fetchAndShowResult(newUrl);
        query.value = "";
    }
}


// Event Listener
form.addEventListener('submit', handleSearch);
window.addEventListener('scroll', detectEnd);
window.addEventListener('resize', detectEnd);

// Initial the Page
async function init(){
    clearResults();
    const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    isSearching = false;
    await fetchAndShowResult(url);
}

init();