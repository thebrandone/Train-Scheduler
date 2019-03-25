$(document).ready(function() {
  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCTz_-WaoEUt_EY9TCfyfQvs-N9sCfBCzA",
    authDomain: "train-scheduler-52cec.firebaseapp.com",
    databaseURL: "https://train-scheduler-52cec.firebaseio.com",
    projectId: "train-scheduler-52cec",
    storageBucket: "train-scheduler-52cec.appspot.com",
    messagingSenderId: "599258723960"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

// adding new train
  $("#add-train-btn").on("click", function (event) {
    event.preventDefault();
  
    // Grabs user input
    var name = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var first = $("#first-input").val().trim();
    var freq = $("#frequency-input").val().trim();

    database.ref().push({
      name: name,
      destination: destination,
      first: first,
      freq: freq,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  
    alert("Train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#desintation-input").val("");
    $("#first-input").val("");
    $("#frequency-input").val("");
  });
// when info is added to database -  update info
  database.ref().on("child_added", function (childSnapshot) {
    
    // calculate next arrival and minutes away
    var timeFreq = childSnapshot.val().freq;
    var submitTime = childSnapshot.val().first;
    var convertTime = moment(submitTime, "HH:mm");
    var diffTime = moment().diff(moment(convertTime), "minutes");
    var remaindTime = diffTime % timeFreq;
    var minTil = timeFreq - remaindTime;
    var nextArrival = moment().add(minTil, "minutes"); 
    nextArrival = moment(nextArrival).format("hh:mm");

    // checks to see if the train has not begin yet
    // if true, display the first train time and take time difference and make it
    // positive to calcuate how many minutes until the first train
    if (diffTime < 0) {
        nextArrival = submitTime;
        minTil = moment().add(submitTime, "minutes");
        minTil = Math.abs(diffTime);
    }
    
    // display data
    var newRow = $("<tr>").append(
      $("<td>").text(childSnapshot.val().name),
      $("<td>").text(childSnapshot.val().destination),
      $("<td>").text(childSnapshot.val().first),
      $("<td>").text(childSnapshot.val().freq),
      $("<td>").text(nextArrival),
      $("<td>").text(minTil)
    );
    $("#train-table > tbody").append(newRow);
  }, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
});