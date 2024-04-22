async function fetchCardData(id) {
    try {
        let apiKey = '123abc';
        let url = `https://api.pokemontcg.io/v2/cards/${id}?apiKey=${apiKey}`;

        let response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let result = await response.json();

        let cardName = result.data.name;
        document.getElementById("cardName").textContent = cardName;

        let cardImageUrl = result.data.images.small;
        document.getElementById("cardImage").src = cardImageUrl;

    } catch (error) {
        console.error('Error fetching card data:', error);
    }

}


async function searchByName(name) {
    try {
        let apiKey = '123abc';
        let url = `https://api.pokemontcg.io/v2/cards?q=name:"${name}"&apiKey=${apiKey}`;

        let response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let result = await response.json();

        if (result.data.length > 0) {
            // Clear previous results
            document.getElementById("cardList").innerHTML = '';

            // Display card names and images in a list
            let cardList = document.createElement('ul');
            result.data.forEach(card => {
                let cardItem = document.createElement('li');
                
                let cardImage = document.createElement('img');
                cardImage.src = card.images.small; // Use small image URL
                cardImage.alt = card.name;
                
                let cardName = document.createElement('span');
                cardName.textContent = card.name;

                cardItem.appendChild(cardImage);
                cardItem.appendChild(cardName);

                cardList.appendChild(cardItem);
            });

            document.getElementById("cardList").appendChild(cardList);
        } else {
            document.getElementById("cardList").textContent = 'No cards found.';
        }

    } catch (error) {
        console.error('Error fetching card data:', error);
        document.getElementById("cardList").textContent = 'No cards found.';
    }   
}

async function getPokedexEntry(name) {
    try {
        let url = `https://pokeapi.co/api/v2/pokemon-species/${name}/`;

        let response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        let result = await response.json();

        if (result) {
            document.getElementById("dex").innerHTML = '';

            let flavorTextEntries = result.flavor_text_entries.filter(entry => {
                return entry.language.name === 'en'; // Filter by English language
            });

            if (flavorTextEntries && flavorTextEntries.length > 0) {
                let dexInfo = document.createElement('ul');

                flavorTextEntries.forEach(entry => {
                    let listItem = document.createElement('li');
                    let versionName = entry.version.name;
                    let flavorText = entry.flavor_text;

                    // Format flavor text with version information
                    listItem.textContent = `${versionName.toUpperCase()}: ${flavorText}`;
                    dexInfo.appendChild(listItem);
                });

                document.getElementById("dex").appendChild(dexInfo);
            } else {
                document.getElementById("dex").textContent = 'No English flavor text found for this Pokémon.';
            }
        } else {
            document.getElementById("dex").textContent = 'No data found for this Pokémon.';
        }

    } catch (error) {
        document.getElementById("dex").textContent = 'No available  dex entries.';
        console.error('Error fetching dex entry:', error);
    }
}



let searchButton = document.getElementById("searchButton");
 
searchButton.addEventListener('click', async() => {
    //console.log(document.getElementById('searchInput').value);
    searchByName(document.getElementById('searchInput').value);
    getPokedexEntry(document.getElementById('searchInput').value);

});