// Variable to store the selected user
var selectedUser = '';
var isSelected = false;

// Object to store user availability data
var availability = {
  user1: [],
  user2: [],
  user3: [],
  user4: [],
  user5: [],
  user6: []
};

// Function to handle date click
function dateClicked(element, date) {
  if(isSelected) {
    var userAvailability = availability[selectedUser];

    // Initialize userAvailability if it's undefined
    if (!userAvailability) {
      userAvailability = [];
      availability[selectedUser] = userAvailability;
    }
  
    var index = userAvailability.indexOf(date);
  
    if (index === -1) {
      // Date not selected, add it to user availability and change button class
      userAvailability.push(date);
      element.style.color = 'red';
      // Save the updated availability to a file
      writeData(selectedUser, date);
    } else {
      // Date already selected, remove it from user availability and reset button class
      userAvailability.splice(index, 1);
      element.style.color = 'white';
      console.log('date removed');
      // Remove the date from the file
      removeData(selectedUser, date);
    }
  }
}

// Function to load person info and display availability
function loadPersonInfo(user) {
  // Save current user's availability (if any)
  if (selectedUser !== '') {
    // Reset all dates on calendar to white (display)
    var selectAll = document.querySelectorAll('.myButton');
    selectAll.forEach(function (dateButton) {
      dateButton.style.color = 'white';
    });
  }

  // Load selected user's availability from the database
  loadRecord(user)
    .then((currentUserAvailability) => {
      // Update selected user
      selectedUser = user;

      // Display current user's availability
      console.log('Current user availability:', currentUserAvailability);

      // Visually display the dates (display)
      currentUserAvailability.forEach(function (date) {
        console.log('change color suppose');
        var button = document.querySelector(".myButton[data-date='" + date + "']");
        if (button) {
          button.style.color = 'red';
        }
      });
    })
    .catch((error) => {
      console.error("Error loading person info:", error);
    });
}

import { initializeApp } from  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {getDatabase, ref, push, child, update, remove, onValue, orderByChild, equalTo, get} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

    const firebaseConfig = {
      apiKey: "AIzaSyBU8St7pE10vG8JzrXsb_N9DRFKGGX04rI",
      authDomain: "event-planning-d8294.firebaseapp.com",
      databaseURL: "https://event-planning-d8294-default-rtdb.firebaseio.com",
      projectId: "event-planning-d8294",
      storageBucket: "event-planning-d8294.appspot.com",
      messagingSenderId: "852698954952",
      appId: "1:852698954952:web:012bab71b0d25d2481f9fd"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    function writeData(userID, date) {
      const db = getDatabase();
      const reference = ref(db, 'availability/' + userID);
      push(reference, {
        date: date
        });
    }

    function removeData(userID, date) {
      const db = getDatabase();
      // Find the specific date to remove
      var reference = ref(db, 'availability/' + userID);

      // Retrieve the data once
      get(reference)
        .then((snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childValue = childSnapshot.val();
              if(childValue.date === date) {
                remove(ref(db, 'availability/' + userID + '/' + childKey));
              }
          });
        })
        .catch((error) => {
          console.error("Error retrieving data:", error);
        });
    }

    function loadRecord(userID) {
      return new Promise((resolve, reject) => {
        const db = getDatabase();
        const reference = ref(db, 'availability/' + userID);
        var userAvailability = availability[userID];
    
        get(reference)
          .then((snapshot) => {
            userAvailability.length = 0; // Clear the array
    
            snapshot.forEach((childSnapshot) => {
              const childValue = childSnapshot.val();
              if (childValue && childValue.date) {
                userAvailability.push(childValue.date);
              }
            });
    
            console.log("Current User is " + userID + ":", userAvailability);
            resolve(userAvailability); // Resolve the promise with the availability data
          })
          .catch((error) => {
            console.error("Error retrieving data:", error);
            reject(error);
          });
      });
    }

// Attack event listeners to user buttons
var nameButtons = document.querySelectorAll('.name-button');
nameButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    var user = button.getAttribute('user');
    isSelected = true;
    loadPersonInfo(user);
  })
})


// Attach event listeners to date buttons
var dateButtons = document.querySelectorAll('.myButton');
dateButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    var date = button.getAttribute('data-date');
    dateClicked(button, date);
    //writeData(selectedUser, date);
  });
});



