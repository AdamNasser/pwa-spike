$(document).ready(function() {

    let card = $('.cardTemplate').clone(); 

    $.ajax({
      url: 'https://cbi-store-api-qa.herokuapp.com/v3/stores/?apiKey=compass&signature=0QJkbTzuM/WSxz9oGuUnPR4uJtGjZ4PHEUfgNJ56L/0=&beverageType=WineSpirits&city=CUPERTINO&searchText=saf*%2A&state=CA', 
      type: 'GET',
      data: {
        format: 'json'
      },
      success: function(response) {
        window.console&&console.log('SUCCESS');
         $('.location').text(`The temperature in Kelvins is ${response.storeName}.`);
      },
      error: function() {
        $('#errors').text("There was an error processing your request. Please try again.")
      }
    });
 
});