
const CLIENT_ID = "4638e93488834c52be72e262d9e372a3";
const CLIENT_SECRET = "267ba46755914f08891410c5842186f5";
let accessToken;


async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    accessToken = data.access_token;
}


async function searchSpotify(query) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track,artist,album`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    displayResults(data.tracks.items);
}


function displayResults(tracks) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; 

    if (tracks.length > 0) {
        tracks.forEach((track, index) => {
            const card = document.createElement('div');
            card.classList.add('result-card');
            card.dataset.index = index; 
            card.style.cursor = 'pointer';

  
            card.innerHTML = `
                <img src="${track.album.images[0].url}" alt="${track.name}">
                <h3>${track.name}</h3>
                <p>Artist: ${track.artists[0].name}</p>
                <p>Album: ${track.album.name}</p>
                <p>Release Year: ${track.album.release_date.split('-')[0]}</p>
            `;

            
            const playerContainer = document.createElement('div');
            playerContainer.style.display = 'none'; 
            playerContainer.style.marginTop = '1rem';

           
            playerContainer.innerHTML = `
                <iframe src="https://open.spotify.com/embed/track/${track.id}" 
                    width="100%" height="380" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy">
                </iframe>
            `;

           
            card.addEventListener('click', () => {
                
                const allCards = document.querySelectorAll('.result-card');
                allCards.forEach(c => {
                    if (c !== card) {
                        c.classList.add('slide-out');
                    }
                });

                
                setTimeout(() => {
                    allCards.forEach(c => {
                        if (c !== card) {
                            c.style.display = 'none';
                        }
                    });

                   
                    playerContainer.style.display = 'block';
                }, 500); 
            });

           
            resultsContainer.appendChild(card);
            resultsContainer.appendChild(playerContainer);
        });
    } else {
        resultsContainer.innerHTML = '<p>No results found. Try another search!</p>';
    }
}



function recommendRandomMood() {
    const moods = ['Happy', 'Relaxed', 'Energetic', 'Sad'];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    alert(`Here’s a playlist for your mood: ${randomMood}`);
}


document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    if (query) {
        searchSpotify(query);
    }
});

document.getElementById('recommend-button').addEventListener('click', recommendRandomMood);


getAccessToken();
