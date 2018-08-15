importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');


 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAJ5X7NGIoS36zuAiKb2Dk5HCOTfj_lOYQ",
    authDomain: "pwa-demo-new.firebaseapp.com",
    databaseURL: "https://pwa-demo-new.firebaseio.com",
    projectId: "pwa-demo-new",
    storageBucket: "gs://pwa-demo-new.appspot.com",
    messagingSenderId: "997650602127"
  };
  firebase.initializeApp(config);


  //ask for push permission here 
  const messaging = firebase.messaging(); 
  messaging.requestPermission().then(function() {
    //get Token 
    return messaging.getToken(); 
  }) .then(function(token) {


      console.log("SUBSCRIBED SUCCESSFULLY"); 

      //send token to server here 
      console.log(token); 
  })
      .catch(function(err) {
        console.log(err); 
        console.log("Permission Denied"); 
      }); 