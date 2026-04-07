const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

const showFavoritesBtn = document.getElementById('showFavoritesBtn');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const showResultsBtn = document.getElementById('showResultsBtn');

// NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

// Scroll To Top, Remove Loader, Show Content
function showContent(page) {
  window.scrollTo({ top: 0, behavior: 'instant' });
  loader.classList.add('hidden');

  if (page === 'results') {
    resultsNav.classList.remove('hidden');
    favoritesNav.classList.add('hidden');
  } else {
    resultsNav.classList.add('hidden');
    favoritesNav.classList.remove('hidden');
  }
}

// Create image cards in DOM
function createDOMNodes(page) {
  //agar fav wala page ho to ls se lo or render kro
  const currentArray = page === 'results' ? resultsArray : Object.values(favorites);

  currentArray.forEach((result) => {
    // Card Container
    const card = document.createElement('div');
    card.classList.add('card');

    // Link
    const link = document.createElement('a');
    link.href = result.hdurl || result.url;
    link.title = 'View Full Image';
    link.target = '_blank';

    // Image
    const image = document.createElement('img');
    image.src = result.url;
    image.alt = result.title || 'NASA Picture of the Day';
    image.loading = 'lazy';
    image.classList.add('card-img-top');

    // Card Body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Card Title
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = result.title;

    // Save / Remove Text Button
    const actionText = document.createElement('p');
    actionText.classList.add('clickable');
    actionText.dataset.url = result.url;

    if (page === 'results') {
      actionText.textContent = 'Add To Favorites';
      actionText.classList.add('add-favorite');
    } else {
      actionText.textContent = 'Remove Favorite';
      actionText.classList.add('remove-favorite');
    }

    // Card Text
    const cardText = document.createElement('p');
    cardText.textContent = result.explanation;

    // Footer Container
    const footer = document.createElement('small');
    footer.classList.add('text-muted');

    // Date
    const date = document.createElement('strong');
    date.textContent = result.date;

    // Copyright
    const copyrightResult = result.copyright === undefined ? '' : result.copyright;
    const copyright = document.createElement('span');
    copyright.textContent = ` ${copyrightResult}`;

    // Append
    footer.append(date, copyright);
    cardBody.append(cardTitle, actionText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

// Update DOM based on page type
function updateDOM(page) {
  const storedFavorites = localStorage.getItem('nasaFavorites');
  favorites = storedFavorites ? JSON.parse(storedFavorites) : {};

  imagesContainer.textContent = '';
  createDOMNodes(page);
  showContent(page);
}

// Get 10 images from NASA API
async function getNasaPictures() {
  loader.classList.remove('hidden');

  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM('results');
  } catch (error) {
    loader.classList.add('hidden');
    console.error('Error fetching NASA images:', error);
  }
}

// Add result to Favorites
function saveFavorite(itemUrl) {
  resultsArray.forEach((item) => {
    if (item.url === itemUrl && !favorites[itemUrl]) {
      favorites[itemUrl] = item;

      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);

      localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    }
  });
}

// Remove item from Favorites
function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    updateDOM('favorites');
  }
}

// ----------------------
// Event Listeners
// ----------------------

// Top nav buttons
showFavoritesBtn.addEventListener('click', () => {
  updateDOM('favorites');
});

loadMoreBtn.addEventListener('click', () => {
  getNasaPictures();
});

showResultsBtn.addEventListener('click', () => {
  getNasaPictures();
});

// Event delegation for dynamic buttons
imagesContainer.addEventListener('click', (event) => {
  const addBtn = event.target.closest('.add-favorite');
  const removeBtn = event.target.closest('.remove-favorite');

  if (addBtn) {
    const itemUrl = addBtn.dataset.url;
    saveFavorite(itemUrl);
  }

  if (removeBtn) {
    const itemUrl = removeBtn.dataset.url;
    removeFavorite(itemUrl);
  }
});

// On Load
// getNasaPictures();
window.addEventListener('DOMContentLoaded', getNasaPictures);
