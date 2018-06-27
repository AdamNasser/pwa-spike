(function() {
  'use strict';



  var app = {
    isLoading: true,
    visibleCards: {},
    cardCount: 0, 
    products: [  
    {name: 'MODELO', url: 'https://api.myjson.com/bins/18eda6', imageURL: 'nil'  } , 
    {name: 'CORONA', url: 'https://api.myjson.com/bins/19l8hq', imageURL: 'nil'  }, 
    {name: 'PACIFICO', url: 'https://api.myjson.com/bins/1gqfr2', imageURL: 'nil'  }, 
    {name: 'VICTORIA', url: 'https://api.myjson.com/bins/hlv26', imageURL: 'nil'  }, 
    {name: 'BARRILITO', url: 'https://api.myjson.com/bins/wjuce', imageURL: 'nil'  }, 
    {name: 'TOCOYA', url: 'https://api.myjson.com/bins/xqpjy', imageURL: 'nil'  }, 
    {name: 'LEON', url: 'https://api.myjson.com/bins/ibkzi', imageURL: 'nil'  }, 
    ] , 
    offlineData: {"products":[{ id: "228-552-101", 
                    brand: "OFFLINE DATA ", 
                    brandCode: "228", 
                    name: "CORONA EXTRA 16OZ CAN", 
                    type: "package" 
                    }, { id: "228-552-101", 
                    brand: "OFFLINE DATA ", 
                    brandCode: "228", 
                    name: "CORONA EXTRA 16OZ CAN", 
                    type: "package" 
                    }, { id: "228-552-101", 
                    brand: "OFFLINE DATA ", 
                    brandCode: "228", 
                    name: "CORONA EXTRA 16OZ CAN", 
                    type: "package" 
                    },{ id: "228-552-101", 
                    brand: "OFFLINE DATA ", 
                    brandCode: "228", 
                    name: "CORONA EXTRA 16OZ CAN", 
                    type: "package" 
                    }]},
    selectedProduct: -1,
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    addDialog: document.querySelector('.dialog-container'),
    customSelector: document.querySelector('.custom-select'), 
    resultsText: document.querySelector('.lead'), 
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 
    selectedIndex: 0 , 
  };


/*****************************************************************************
   *
   * Script to handle product custom selector and click events 
   *
   ****************************************************************************/
var x, i, j, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < selElmnt.length; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;

    

    c.addEventListener("click", function(e) {

   var s = this.parentNode.parentNode.getElementsByTagName("select")[0];
/*when an item is clicked, update the original select box,
        and the selected item:*/
        var y, i, k, h;
      
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i-1;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;


          }
        }
        h.click();

       
        /* clear our current product deck when the user selects a new one  */
      for(var i = 0; i < Object.keys(app.visibleCards).length; i++) {
      var currentCard = app.visibleCards[i]; 
      console.log(currentCard); 
      currentCard.parentNode.removeChild(currentCard);
    }
   for (var member in app.visibleCards) delete app.visibleCards[member]; 
    /* done clearing  */ 

  
    /* get the user's new card deck */ 
    console.log("selected index is: ", s.selectedIndex); 
    app.selectedProduct = s.selectedIndex; 
    app.saveSelection(); 
    app.getProduct(s.selectedIndex);
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
  });

}
function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);

/*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/




 function updateCurrentLocation() {

 }

 
  // Updates product cards 
  app.updateProductCard = function(data) {

    //var searchText = app.title.cloneNode(true); 
   // searchText.textContent = "Hello"; 
   //console.log(data.products[0]); 
  

    for(var i = 0; i < data.products.length; i++) {

    var resultCount = data.products.length; 

    

    var obj = data.products[i]; 
    //console.log(obj); 

    var brandName = obj.brand; 
    var productName = obj.name; 
    var productType = obj.brandCode; 


    app.resultsText.textContent = "Displaying " + resultCount + " results for " + brandName; 

    //instantiate unique identifier as well 

    var card = app.visibleCards[300];
     
    if (!card) { //create a new card if it doesnt exist 

      app.cardCount += 1;     
      card = app.cardTemplate.cloneNode(true);
      card.classList.remove('cardTemplate');
      card.querySelector('.location').textContent = brandName;
      card.removeAttribute('hidden');
      card.querySelector('.back');
      app.container.appendChild(card);
      app.visibleCards[i] = card; 

    }
     card.querySelector('.location').textContent = brandName; 
     card.querySelector('.date').textContent = productName; 
     card.querySelector('.description').textContent = productType; 

    }

     //console.log("card count is ",app.cardCount); 
  
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


//save the product the user selected to local storage 
   app.saveSelection = function() {
        var selectedProduct = app.selectedProduct; 
        console.log("selected product is: "); 
           
        localStorage.selectedProduct = selectedProduct; 
   }; 




  app.getProduct = function(selectedProductIndex) {

/* FOR V3 
//first part of query string 
  const querystring = Object.keys(data)
  .map(key => key + '=' + encodeURIComponent(data[key]))
  .join('&'); 

//second part of query string to join the correct search term to the right %2A string 

const citystring = Object.keys(citydata) 
.map(key => key + '=' + encodeURIComponent(citydata[key])) + '*' + '%2A' + '&'; 


const statestring = Object.keys(statedata) 
  .map(key => key + '=' + encodeURIComponent(statedata[key])); 

  var newurl = 'https://cbi-store-api-qa.herokuapp.com/v3/stores/?apiKey=compass&signature=0QJkbTzuM/WSxz9oGuUnPR4uJtGjZ4PHEUfgNJ56L/0=&' + querystring +'&'+ citystring + statestring + '/'; 
  console.log("HELLO"); 
  console.log(newurl); 
  */

//var url = 'https://api.myjson.com/bins/18eda6';

//set the appropriate product url 

console.log(selectedProductIndex); 
app.selectedProduct = selectedProductIndex;  
var url = app.products[selectedProductIndex].url; 

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
            app.updateProductCard(results);
          });
        }
      });
    }
    */


fetch(url)
    .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response.json();
    }).then(function(responseJson) {
        console.log(responseJson); 
        app.updateProductCard(responseJson); 
    }).catch(function(error) {
        app.updateProductCard(app.offlineData); 
        console.log(error);
    });


   
  };


 


app.selectedProduct = localStorage.selectedProduct;
  if(app.selectedProduct > -1) { // we have a saved selected product  
      app.getProduct(app.selectedProduct); 
  } else { //user is using app for the first time , present them with the initial data
       app.getProduct(0); 
  }

   


  

  // TODO add service worker code here
   if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('/service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });

 }




})();
