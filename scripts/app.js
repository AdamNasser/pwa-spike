
(function() {
  'use strict';

  var app = {
    isLoading: true,
    visibleCards: {},
    selectedCities: [],
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    addDialog: document.querySelector('.dialog-container'),
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 
    title: document.querySelector('.searchTitle'), 
  };


/*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

   document.getElementById("butAdd").addEventListener("click", function() {
    // Open/show the add new city dialog
    app.toggleAddDialog(true);
  });

  document.getElementById("butAddCity").addEventListener("click", function() {
    // Add the newly selected city
    var select = document.getElementById("selectCityToAdd");
    var selected = select.options[select.selectedIndex];
    var key = selected.value;
    var label = selected.textContent;
    if (!app.selectedCities) {
      app.selectedCities = [];
    }
    //app.getForecast(key, label);
    //app.selectedCities.push({key: key, label: label});
    //app.saveSelectedCities();
    app.toggleAddDialog(false);
  });

  document.getElementById("butAddCancel").addEventListener("click", function() {
    // Close the add new city dialog
    app.toggleAddDialog(false);
  });


  

  // Toggles the visibility of the add new city dialog.
  app.toggleAddDialog = function(visible) {
    if (visible) {
      app.addDialog.classList.add("dialog-container--visible");
    } else {
      app.addDialog.classList.remove("dialog-container--visible");
    }
  };



  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

 
  // Updates a weather card with the latest weather forecast. If the card
  // doesn't already exist, it's cloned from the template.
  app.updateForecastCard = function(data) {

    var searchText = app.title.cloneNode(true); 
    searchText.textContent = "Hello"; 
   
    

    for(var i = 0; i < data.length; i++) {
    var obj = data[i]; 
    var storeName = obj.store_name; 
    var address = obj.address; 
    var premise = obj.premise_type; 

    //instantiate unique identifier as well 
    var card = app.visibleCards[data.key];

      
    if (!card) { //create a new card if it doesnt exist 
      card = app.cardTemplate.cloneNode(true);
      card.classList.remove('cardTemplate');
      card.querySelector('.location').textContent = data.store_name;
      card.removeAttribute('hidden');
      card.querySelector('.back');
      app.container.appendChild(card);
      //app.visibleCards[data.key] = card;
    }
     card.querySelector('.location').textContent = storeName; 
     card.querySelector('.date').textContent = address; 
     card.querySelector('.description').textContent = premise; 

    }
  
    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  };


  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  /*
   * Gets a forecast for a specific city and updates the card with the data.
   * getForecast() first checks if the weather data is in the cache. If so,
   * then it gets that data and populates the card with the cached data.
   * Then, getForecast() goes to the network for fresh data. If the network
   * request goes through, then the card gets updated a second time with the
   * freshest data.
   */
  app.getForecast = function() {
  var url = 'https://cbi-api-internal-qa.herokuapp.com/v2/beerStores?apiKey=compass-beer&filterUnsold=Y&includeStoreRank=Y&lowerRightBound=37.330966%2C-122.029159&signature=AziYxd1PhDbUvQIAjSBfgb5fs3nsAHeO848/Y4j3FDg%3D&upperLeftBound=37.338737%2C-122.037399';
  // TODO add cache logic here
    
/*
       * Check if the service worker has already cached this city's weather
       * data. If the service worker has the data, then display the cached
       * data while the app fetches the latest data. Was preventing the app from fetching new data 
       */

       /*
    if ('caches' in window) {
      
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function updateFromCache(json) {
            var results = json.query.results;
            results.key = key;
            results.label = label;
            results.created = json.query.created;
            app.updateForecastCard(results);
          });
        }
      });
    }
    */

    // Fetch the latest data.
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
    console.log(responseJson);
    app.updateForecastCard(responseJson);  
    });
  };

  // Iterate all of the cards and attempt to get the latest forecast data
  app.updateForecasts = function() {
    var keys = Object.keys(app.visibleCards);
    keys.forEach(function(key) {
      app.getForecast(key);
    });
  };



  // TODO uncomment line below to test app with fake data
  app.getForecast(); 

  // TODO add startup code here

  // TODO add service worker code here
   if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('/service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });

 }
})();
