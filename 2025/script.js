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
        return []; // Return an empty array on error to prevent further issues
    }
}

// Function to sort games based on a property and direction
function sortGames(property, direction) {
    const gamesContainer = document.getElementById('game-container');
    const games = Array.from(gamesContainer.children);

    games.sort((a, b) => {
        let valueA, valueB;

        switch (property) {
            case 'title':
                valueA = a.querySelector('h2').textContent.toLowerCase();
                valueB = b.querySelector('h2').textContent.toLowerCase();
                break;
            case 'platform':
                valueA = a.querySelector('p').textContent.split(' ')[1];
                valueB = b.querySelector('p').textContent.split(' ')[1];
                break;
            case 'players':
                valueA = parseInt(a.querySelector('p').textContent.split(' ')[2]);
                valueB = parseInt(b.querySelector('p').textContent.split(' ')[2]);
                break;
            case 'rating':
                valueA = parseFloat(a.querySelector('.rating-label').textContent);
                valueB = parseFloat(b.querySelector('.rating-label').textContent);
                break;
            default:
                break;
        }

        if (direction === 'desc') {
            return valueB > valueA ? 1 : -1; // Descending order
        } else {
            return valueA > valueB ? 1 : -1; // Ascending order
        }
    });

    // Clear current games in container
    gamesContainer.innerHTML = '';

    // Append sorted games to container
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
        const title = game.querySelector('h2').textContent.toLowerCase();
        if (title.includes(keyword.toLowerCase())) {
            game.style.display = 'block';
        } else {
            game.style.display = 'none';
        }
    });

    updateGameCount(); // Update the game count after searching
}

// Function to load game in respective player.html based on playerv
function loadGameInPlayer(game) {
    const playerHTML = `player${game.playerv.substr(-2)}.html`; // Assuming playerv is like 'player01', 'player02', etc.
    // Encode game data to pass as URL parameters
    const encodedGameData = encodeURIComponent(JSON.stringify(game));
    // Redirect to respective player.html with game data as URL parameter
    window.location.href = `${playerHTML}?game=${encodedGameData}`;
}

// Function to update the game count
function updateGameCount() {
    const gamesContainer = document.getElementById('game-container');
    const displayedGames = Array.from(gamesContainer.children).filter(game => game.style.display !== 'none');
    document.getElementById('title-count').textContent = `${displayedGames.length} Games`;
}

// Function to handle image loading with fallback to default.jpg
function loadImageWithFallback(image, imageName) {
    const extensions = ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'gif', 'GIF'];
    let imageFound = false;

    const loadImage = index => {
        if (index >= extensions.length) {
            // If all extensions have been tried and image not found, use default.jpg
            image.src = 'covers/default.jpg';
            return;
        }

        image.src = `covers/${imageName}.${extensions[index]}`;
        image.onerror = () => loadImage(index + 1); // Try the next extension if image fails to load
        image.onload = () => { imageFound = true; }; // Mark image found if loaded successfully
    };

    loadImage(0); // Start trying to load the image with the first extension

    // If image not found after all extensions, use default.jpg
    setTimeout(() => {
        if (!imageFound) {
            image.src = 'covers/default.jpg';
        }
    }, 2000); // Adjust timeout as needed
}

// Fetch data and display games
async function init() {
    try {
        const games = await fetchData('version.json');
        const gameContainer = document.getElementById('game-container');

        games.forEach(game => {
            // Create a container for each game
            const gameDiv = document.createElement('div');
            gameDiv.classList.add('game');
            gameDiv.dataset.core = game.core; // Use 'core' instead of 'xcore'

            // Create an image container
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');

            // Create an image element
            const image = document.createElement('img');
            // Use the game title as the image name
            const imageName = game.title.replace(/\s+/g, '%20'); // Replace spaces with %20

            // Load image with fallback to default.jpg
            loadImageWithFallback(image, imageName);

            // Modify event listener to load game in respective player.html
            image.addEventListener('click', () => loadGameInPlayer(game));
            imageContainer.appendChild(image);

            // Create a rating label
            const ratingLabel = document.createElement('div');
            ratingLabel.classList.add('rating-label');
            ratingLabel.textContent = `${game.rating}`;
            imageContainer.appendChild(ratingLabel);

            gameDiv.appendChild(imageContainer);

            // Create a paragraph element for the title
            const titlePara = document.createElement('h2');
            titlePara.textContent = game.title;
            gameDiv.appendChild(titlePara);

            // Create a paragraph element for additional information
            const infoPara = document.createElement('p');
            infoPara.textContent = `${game.year} ${game.platform} ${game.players}P`;
            gameDiv.appendChild(infoPara);

            // Add the game container to the main container
            gameContainer.appendChild(gameDiv);
        });

        updateGameCount(); // Update the game count after displaying games

        // Populate the core filter options after games are displayed
        const cores = [...new Set(games.map(game => game.core))];
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

        // Add event listener for sorting
        const sortSelect = document.getElementById('sort');
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            const sortOrder = 'asc'; // Default to ascending order
            sortGames(sortBy, sortOrder);
        });

    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

// Initialize the application
init();
