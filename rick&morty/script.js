// Function to fetch random character data
async function fetchRandomCharacter() {
    try {
        const randomId = Math.floor(Math.random() * 820) + 1;
        const response = await fetch(`https://rickandmortyapi.com/api/character/${randomId}`);
        const data = await response.json();
        
        // Extract episode number from the first episode URL
        const episodeNumber = data.episode[0].split('/').pop();
        
        // Update DOM elements with character data
        document.querySelector('h1').textContent = data.name.length > 18 ? 
            data.name.substring(0, 18) + '...' : data.name;
        document.querySelector('.front p span').textContent = data.created.substring(0, 10);
        document.querySelector('.price').textContent = data.species;
        
        // Update back of card
        document.querySelector('.right h2').textContent = data.name;
        const detailsList = document.querySelector('.right ul');
        detailsList.innerHTML = `
            <li>Status ${data.status}</li>
            <li>Gender ${data.gender}</li>
            <li>Origin ${data.origin.name}</li>
            <li>Episode ${episodeNumber}</li>
        `;
        
        // Update character image
        document.querySelector('.img-wrapper img').src = data.image;
    } catch (error) {
        console.error('Error fetching character:', error);
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchRandomCharacter); 