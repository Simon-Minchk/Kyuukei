document.addEventListener('DOMContentLoaded', function(){
  var popularityTab = document.getElementById('popularity-tab');
  var alphabeticalTab = document.getElementById('alphabetical-tab');
  var sortedTab = document.getElementById('sorted-tab');

  var popularityContainer = document.getElementById('popularity-container');
  var alphabeticalContainer = document.getElementById('alphabetical-container');
  var sortedContainer = document.getElementById('sorted-container');

  function clearActive() {
    var tabs = document.querySelectorAll('.sort-tab');
    tabs.forEach(function(tab){
      tab.classList.remove('active');
    });
  }

  if(popularityTab) {
    popularityTab.addEventListener('click', function(){
      clearActive();
      popularityTab.classList.add('active');
      if(popularityContainer) popularityContainer.style.display = 'grid';
      if(alphabeticalContainer) alphabeticalContainer.style.display = 'none';
      if(sortedContainer) sortedContainer.style.display = 'none';
    });
  }

  if(alphabeticalTab) {
    alphabeticalTab.addEventListener('click', function(){
      clearActive();
      alphabeticalTab.classList.add('active');
      if(popularityContainer) popularityContainer.style.display = 'none';
      if(alphabeticalContainer) alphabeticalContainer.style.display = 'grid';
      if(sortedContainer) sortedContainer.style.display = 'none';
    });
  }

  if(sortedTab) {
    sortedTab.addEventListener('click', function(){
      clearActive();
      sortedTab.classList.add('active');
      if(popularityContainer) popularityContainer.style.display = 'none';
      if(alphabeticalContainer) alphabeticalContainer.style.display = 'none';
      if(sortedContainer) {
          sortedContainer.style.display = 'grid';
          // Reset: show the category list and hide any category-specific container
          var categoryList = document.getElementById('sorted-category-list');
          if(categoryList) categoryList.style.display = 'grid';
          var categoryContainers = document.querySelectorAll('.category-characters');
          categoryContainers.forEach(function(container) {
            container.style.display = 'none';
          });
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.getElementById('nav-toggle');
  const navMobileMenu = document.getElementById('nav-mobile-menu');
  if (navToggle && navMobileMenu) {
    navToggle.addEventListener('click', function() {
      navMobileMenu.style.display = (navMobileMenu.style.display === 'block') ? 'none' : 'block';
    });
  }
});

function loadCategory(slug) {
  // Hide the category list
  var categoryList = document.getElementById('sorted-category-list');
  if(categoryList) categoryList.style.display = 'none';
  // Show the container for the chosen category
  var container = document.getElementById('category-' + slug + '-container');
  if (container) {
    container.style.display = 'grid';
  }
}

/* --- Character of the Day Section using Seeded Random --- */
document.addEventListener('DOMContentLoaded', function() {
  fetch('/characters.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(characters => {
      console.log('Fetched characters:', characters);
      if (!Array.isArray(characters) || characters.length === 0) {
        console.warn('No characters found in JSON.');
        return;
      }
      
      // Create a seed based on today's date in YYYYMMDD format.
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const seedString = `${year}${month}${day}`; // e.g. "20250309"
      const seed = parseInt(seedString, 10);
      
      // Simple Linear Congruential Generator (LCG) for seeded randomness.
      function seededRandom(seed) {
        const m = 0x80000000; // 2^31
        const a = 1103515245;
        const c = 12345;
        seed = (seed * a + c) % m;
        return seed / m;
      }
      
      const rand = seededRandom(seed);
      const index = Math.floor(rand * characters.length);
      console.log('Random index:', index);
      const cod = characters[index];
      console.log('Character of the Day:', cod);
      
      // Inject the Character of the Day info into the container.
      const container = document.getElementById('cod-container');
      if (container && cod) {
        container.innerHTML = `
          <a href="${cod.url}">
            <div class="cod-image" style="background-image: url('${cod.image}');"></div>
            <h3>${cod.title}</h3>
            ${cod.last_modified_at ? `<p>Last updated: ${new Date(cod.last_modified_at).toLocaleString()}</p>` : ''}
          </a>
        `;
      } else {
        console.warn('Container not found or no character selected.');
      }
    })
    .catch(error => {
      console.error('Error fetching characters:', error);
    });
});
