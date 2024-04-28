// Function to fetch JSON data
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to sort games based on a property and direction
function sortGames(property, direction) {
    const gamesContainer = document.getElementById('game-container');
    const games = Array.from(gamesContainer.children);

    games.sort((a, b) => {
        const gameA = a.querySelector('p').textContent.toLowerCase();
        const gameB = b.querySelector('p').textContent.toLowerCase();

        if (direction === 'asc') {
            return gameA[property] > gameB[property] ? 1 : -1;
        } else {
            return gameA[property] < gameB[property] ? 1 : -1;
        }
    });

    games.forEach(game => {
        gamesContainer.appendChild(game);
    });
}

// Function to filter games based on the selected platform
function filterGamesByCore(core) {
    const gamesContainer = document.getElementById('game-container');
    const games = Array.from(gamesContainer.children);

    games.forEach(game => {
        const gameCore = game.dataset.core;
        if (core === 'all' || gameCore === core) {
            game.style.display = 'block';
        } else {
            game.style.display = 'none';
        }
    });

    updateGameCount(); // Update the game count after filtering
}

// Function to search games based on the entered keyword
function searchGames(keyword) {
    const gamesContainer = document.getElementById('game-container');
    const games = Array.from(gamesContainer.children);

    games.forEach(game => {
        const title = game.querySelector('p').textContent.toLowerCase();
        if (title.includes(keyword.toLowerCase())) {
            game.style.display = 'block';
        } else {
            game.style.display = 'none';
        }
    });

    updateGameCount(); // Update the game count after searching
}

// Function to load game in player.html
function loadGameInPlayer(game) {
    // Encode game data to pass as URL parameters
    const encodedGameData = encodeURIComponent(JSON.stringify(game));
    // Redirect to player.html with game data as URL parameter
    window.location.href = `player.html?game=${encodedGameData}`;
}

// Function to update the game count
function updateGameCount() {
    const gamesContainer = document.getElementById('game-container');
    const displayedGames = Array.from(gamesContainer.children).filter(game => game.style.display !== 'none');
    document.getElementById('xtitle-count').textContent = `Total Games: ${displayedGames.length}`;
}

// Fetch data and display games
async function init() {
    await displayGames();

    // Populate the core filter options
    const games = await fetchData('games.json');
    const cores = [...new Set(games.map(game => game.xcore))];
    const coreFilter = document.getElementById('core-filter');
    cores.forEach(core => {
        const option = document.createElement('option');
        option.value = core;
        option.textContent = core;
        coreFilter.appendChild(option);
    });

    // Add event listener for core filter change
    coreFilter.addEventListener('change', function() {
        const selectedCore = this.value;
        filterGamesByCore(selectedCore);
    });

    // Add event listener for search input
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', function() {
        const keyword = this.value;
        searchGames(keyword);
    });
}

// Function to display game images and load game on click
async function displayGames() {
    const games = await fetchData('games.json');
    const gameContainer = document.getElementById('game-container');

    games.forEach(game => {
        // Create a container for each game
        const gameDiv = document.createElement('div');
        gameDiv.classList.add('game');
        gameDiv.dataset.core = game.xcore; // Add xcore as a data attribute

        // Create an image container
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        // Create an image element
        const image = document.createElement('img');
        if (game.ximage) {
            image.src = game.ximage;
            // Modify event listener to load game in player.html
            image.addEventListener('click', () => loadGameInPlayer(game));
            imageContainer.appendChild(image);
        }

        // Create a rating label
        const ratingLabel = document.createElement('div');
        ratingLabel.classList.add('rating-label');
        ratingLabel.textContent = `${game.rating}`;
        imageContainer.appendChild(ratingLabel);

        gameDiv.appendChild(imageContainer);

        // Create a paragraph element for the title
        const titlePara = document.createElement('h2');
        titlePara.textContent = game.xtitle;
        gameDiv.appendChild(titlePara);

        // Create a paragraph element for additional information
        const infoPara = document.createElement('p');
        infoPara.textContent = `${game.year} ${game.platform} ${game.players} ${game.genres}`;
        gameDiv.appendChild(infoPara);

        // Add the game container to the main container
        gameContainer.appendChild(gameDiv);
    });

    updateGameCount(); // Update the game count after displaying games
}

// Initialize the application
init();
